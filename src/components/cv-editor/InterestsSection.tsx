'use client';

import React, { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCVData } from '@/lib/hooks/useCVData';
import { useDragReorder } from '@/lib/hooks/useDragReorder';
import { Interest } from '@/types/cv';
import { generateId } from '@/lib/utils';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';

export function InterestsSection() {
  const t = useTranslations('forms.interests');
  const tCommon = useTranslations('common');
  const { cvData, addInterest, updateInterest, removeInterest, reorderInterests } = useCVData();
  const interests = cvData.interests || [];
  const [newInterest, setNewInterest] = useState('');

  const {
    containerRef,
    handleDragStart,
    handleDragOver,
    handleDrop,
    handleDragEnd,
    handleContainerDragLeave,
    isDragging,
    getPlaceholderPosition,
    getDraggedItem,
  } = useDragReorder({
    items: interests,
    onReorder: reorderInterests,
  });

  const handleAdd = () => {
    if (newInterest.trim()) {
      const interest: Interest = {
        id: generateId(),
        name: newInterest.trim(),
      };
      addInterest(interest);
      setNewInterest('');
    }
  };

  return (
    <Card
      header={
        <h2 className="text-lg font-semibold">{t('title')}</h2>
      }
    >
      {interests.length > 0 && (
        <ul
          ref={containerRef as React.RefObject<HTMLUListElement>}
          className="space-y-2 mb-4"
          onDragLeave={handleContainerDragLeave}
        >
          {interests.map((interest, index) => {
            const placeholderPos = getPlaceholderPosition(index);
            const draggedItem = getDraggedItem();

            return (
              <React.Fragment key={interest.id}>
                {placeholderPos === 'before' && (
                  <li
                    className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-blue-400 rounded-md bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <span className="text-blue-400 text-sm truncate">
                      {draggedItem?.name}
                    </span>
                  </li>
                )}
                <li
                  onDragOver={(e) => handleDragOver(e, index)}
                  onDrop={(e) => handleDrop(e, index)}
                  className={`flex items-center gap-2 ${
                    isDragging(index) ? 'opacity-30' : ''
                  }`}
                >
                  <span
                    draggable
                    onDragStart={(e) => {
                      const row = e.currentTarget.closest('li') as HTMLElement;
                      if (row) {
                        e.dataTransfer.setDragImage(row, 20, 20);
                      }
                      handleDragStart(e, index);
                    }}
                    onDragEnd={handleDragEnd}
                    className="text-gray-400 cursor-grab select-none hover:text-gray-600"
                  >
                    ⋮⋮
                  </span>
                  <input
                    type="text"
                    value={interest.name}
                    onChange={(e) => updateInterest(interest.id, { name: e.target.value })}
                    placeholder="Photography, Hiking, Reading, etc."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => removeInterest(interest.id)}
                    className="text-red-600 hover:text-red-800 text-sm px-2 py-2"
                  >
                    {tCommon('remove')}
                  </button>
                </li>
                {placeholderPos === 'after' && (
                  <li
                    className="flex items-center gap-2 px-3 py-2 border-2 border-dashed border-blue-400 rounded-md bg-blue-50"
                    onDragOver={(e) => handleDragOver(e, index)}
                    onDrop={(e) => handleDrop(e, index)}
                  >
                    <span className="text-blue-400 text-sm truncate">
                      {draggedItem?.name}
                    </span>
                  </li>
                )}
              </React.Fragment>
            );
          })}
        </ul>
      )}

      {interests.length === 0 && (
        <p className="text-gray-500 text-center py-4 mb-4">
          {t('noInterests')}
        </p>
      )}

      <div className="flex gap-2">
        <input
          type="text"
          placeholder={t('addInterestPlaceholder') || 'Add an interest...'}
          value={newInterest}
          onChange={(e) => setNewInterest(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Button type="button" onClick={handleAdd} size="sm">
          {tCommon('add')}
        </Button>
      </div>
    </Card>
  );
}
