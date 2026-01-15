'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { SkillCategory } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { FormInput } from '../form/FormInput';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function SkillsSection() {
  const t = useTranslations('forms.skills');
  const tCommon = useTranslations('common');
  const { cvData, addSkillCategory, updateSkillCategory, removeSkillCategory, reorderSkillCategories } = useCVData();
  const { skills } = cvData;

  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState<number | null>(null);
  const [dragOverCategoryIndex, setDragOverCategoryIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollAnimationRef = useRef<number | null>(null);
  const mouseYRef = useRef<number>(0);

  const SCROLL_ZONE_HEIGHT = 150;
  const MAX_SCROLL_SPEED = 25;

  const scrollLoop = useCallback(() => {
    const clientY = mouseYRef.current;
    const scrollZoneTop = SCROLL_ZONE_HEIGHT;
    const scrollZoneBottom = window.innerHeight - SCROLL_ZONE_HEIGHT;

    if (clientY < scrollZoneTop) {
      const intensity = (scrollZoneTop - clientY) / SCROLL_ZONE_HEIGHT;
      window.scrollBy({ top: -MAX_SCROLL_SPEED * intensity, behavior: 'instant' });
    } else if (clientY > scrollZoneBottom) {
      const intensity = (clientY - scrollZoneBottom) / SCROLL_ZONE_HEIGHT;
      window.scrollBy({ top: MAX_SCROLL_SPEED * intensity, behavior: 'instant' });
    }

    scrollAnimationRef.current = requestAnimationFrame(scrollLoop);
  }, []);

  const startAutoScroll = useCallback(() => {
    if (!scrollAnimationRef.current) {
      scrollAnimationRef.current = requestAnimationFrame(scrollLoop);
    }
  }, [scrollLoop]);

  const stopAutoScroll = useCallback(() => {
    if (scrollAnimationRef.current) {
      cancelAnimationFrame(scrollAnimationRef.current);
      scrollAnimationRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => stopAutoScroll();
  }, [stopAutoScroll]);

  const handleAdd = () => {
    const newCategory: SkillCategory = {
      id: generateId(),
      categoryName: '',
      skills: [],
    };
    addSkillCategory(newCategory);
  };

  const handleCategoryDragStart = (e: React.DragEvent, index: number) => {
    setDraggedCategoryIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', 'category');
    mouseYRef.current = e.clientY;
    startAutoScroll();
  };

  const handleCategoryDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverCategoryIndex !== index) {
      setDragOverCategoryIndex(index);
    }
    mouseYRef.current = e.clientY;
  };

  const handleContainerDragLeave = (e: React.DragEvent) => {
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      setDragOverCategoryIndex(null);
    }
  };

  const handleCategoryDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    stopAutoScroll();
    if (draggedCategoryIndex === null || draggedCategoryIndex === dropIndex) {
      setDraggedCategoryIndex(null);
      setDragOverCategoryIndex(null);
      return;
    }

    reorderSkillCategories(draggedCategoryIndex, dropIndex);
    setDraggedCategoryIndex(null);
    setDragOverCategoryIndex(null);
  };

  const handleCategoryDragEnd = () => {
    stopAutoScroll();
    setDraggedCategoryIndex(null);
    setDragOverCategoryIndex(null);
  };

  const getCategoryPlaceholderPosition = (index: number): 'before' | 'after' | null => {
    if (draggedCategoryIndex === null || dragOverCategoryIndex === null) return null;
    if (dragOverCategoryIndex !== index) return null;
    if (draggedCategoryIndex === index) return null;

    return draggedCategoryIndex > index ? 'before' : 'after';
  };

  return (
    <Card
      header={
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t('title')}</h2>
          <Button onClick={handleAdd} size="sm">
            + {t('addCategory')}
          </Button>
        </div>
      }
    >
      {skills.length === 0 ? (
        <p className="text-gray-500 text-center py-8">
          {t('noSkills')}
        </p>
      ) : (
        <div
          ref={containerRef}
          className="space-y-4"
          onDragLeave={handleContainerDragLeave}
        >
          {skills.map((category, index) => {
            const placeholderPos = getCategoryPlaceholderPosition(index);
            const isDragging = draggedCategoryIndex === index;

            return (
              <React.Fragment key={category.id}>
                {placeholderPos === 'before' && (
                  <div
                    className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50"
                    onDragOver={(e) => handleCategoryDragOver(e, index)}
                    onDrop={(e) => handleCategoryDrop(e, index)}
                  >
                    <div className="text-blue-400 font-medium">
                      {skills[draggedCategoryIndex!]?.categoryName || t('categoryNumber', { number: draggedCategoryIndex! + 1 })}
                    </div>
                  </div>
                )}
                <div
                  draggable
                  onDragStart={(e) => handleCategoryDragStart(e, index)}
                  onDragOver={(e) => handleCategoryDragOver(e, index)}
                  onDrop={(e) => handleCategoryDrop(e, index)}
                  onDragEnd={handleCategoryDragEnd}
                  className={`border border-gray-200 rounded-lg p-4 bg-white cursor-grab active:cursor-grabbing ${
                    isDragging ? 'opacity-30' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900 flex items-center gap-2">
                      <span className="text-gray-400 cursor-grab">⋮⋮</span>
                      {t('categoryNumber', { number: index + 1 })}
                    </h3>
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => removeSkillCategory(category.id)}
                    >
                      {tCommon('remove')}
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <FormInput
                      label={t('categoryName')}
                      placeholder="e.g., Programming Languages, Tools, Frameworks"
                      value={category.categoryName}
                      onChange={(e) =>
                        updateSkillCategory(category.id, { categoryName: e.target.value })
                      }
                    />

                    <SkillsList
                      skills={category.skills}
                      onChange={(skills) =>
                        updateSkillCategory(category.id, { skills })
                      }
                    />
                  </div>
                </div>
                {placeholderPos === 'after' && (
                  <div
                    className="border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50"
                    onDragOver={(e) => handleCategoryDragOver(e, index)}
                    onDrop={(e) => handleCategoryDrop(e, index)}
                  >
                    <div className="text-blue-400 font-medium">
                      {skills[draggedCategoryIndex!]?.categoryName || t('categoryNumber', { number: draggedCategoryIndex! + 1 })}
                    </div>
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}
    </Card>
  );
}

function SkillsList({
  skills,
  onChange,
}: {
  skills: string[];
  onChange: (skills: string[]) => void;
}) {
  const t = useTranslations('forms.skills');
  const tCommon = useTranslations('common');
  const [newSkill, setNewSkill] = useState('');
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const handleAdd = () => {
    if (newSkill.trim()) {
      onChange([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemove = (index: number) => {
    onChange(skills.filter((_, i) => i !== index));
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
    // Set drag image to be slightly transparent
    if (e.currentTarget instanceof HTMLElement) {
      e.dataTransfer.setDragImage(e.currentTarget, 0, 0);
    }
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleContainerDragLeave = (e: React.DragEvent) => {
    // Only clear if we're leaving the container entirely
    if (containerRef.current && !containerRef.current.contains(e.relatedTarget as Node)) {
      setDragOverIndex(null);
    }
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDragOverIndex(null);
      return;
    }

    const newSkills = [...skills];
    const [draggedSkill] = newSkills.splice(draggedIndex, 1);
    const adjustedDropIndex = draggedIndex < dropIndex ? dropIndex : dropIndex;
    newSkills.splice(adjustedDropIndex, 0, draggedSkill);
    onChange(newSkills);

    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDragOverIndex(null);
  };

  // Calculate where to show the placeholder
  const getPlaceholderPosition = (index: number): 'before' | 'after' | null => {
    if (draggedIndex === null || dragOverIndex === null) return null;
    if (dragOverIndex !== index) return null;
    if (draggedIndex === index) return null;

    return draggedIndex > index ? 'before' : 'after';
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {t('skills')}
      </label>

      {skills.length > 0 && (
        <div
          ref={containerRef}
          className="flex flex-wrap gap-2 mb-3"
          onDragLeave={handleContainerDragLeave}
        >
          {skills.map((skill, index) => {
            const placeholderPos = getPlaceholderPosition(index);
            const isDragging = draggedIndex === index;

            return (
              <React.Fragment key={index}>
                {placeholderPos === 'before' && (
                  <span
                    className="inline-flex items-center px-3 py-1 border-2 border-dashed border-blue-400 rounded-full text-sm text-blue-400 bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {skills[draggedIndex!]}
                  </span>
                )}
                <span
                  draggable
                  onDragStart={(e) => handleDragStart(e, index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  onDragEnd={handleDragEnd}
                  className={`inline-flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm cursor-grab active:cursor-grabbing select-none ${
                    isDragging ? 'opacity-30' : ''
                  }`}
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="text-blue-700 hover:text-blue-900 font-bold"
                    title="Remove"
                  >
                    ×
                  </button>
                </span>
                {placeholderPos === 'after' && (
                  <span
                    className="inline-flex items-center px-3 py-1 border-2 border-dashed border-blue-400 rounded-full text-sm text-blue-400 bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    {skills[draggedIndex!]}
                  </span>
                )}
              </React.Fragment>
            );
          })}
        </div>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Add a skill..."
          value={newSkill}
          onChange={(e) => setNewSkill(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="button" onClick={handleAdd} size="sm">
          {tCommon('add')}
        </Button>
      </div>
    </div>
  );
}
