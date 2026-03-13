// src/app/[locale]/(private)/success-gate-raon-2019/projects/new/ProjectForm.tsx
'use client';

import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function ProjectForm() {
  const form = useForm({
    defaultValues: {
      translations: { ko: { title: '' }, ja: { title: '' }, en: { title: '' } },
      // ...기타 기본값
    },
  });

  return (
    <form className='grid grid-cols-12 gap-8'>
      {/* 좌측: 공통 설정 (3컬럼) */}
      <div className='col-span-4 space-y-6 bg-white p-6 rounded-xl border'>
        <h3 className='font-bold'>Common Info</h3>
        {/* 이미지 업로드, 날짜, 플랫폼 링크 입력 필드들 */}
      </div>

      {/* 우측: 다국어 컨텐츠 (8컬럼) */}
      <div className='col-span-8 bg-white p-6 rounded-xl border'>
        <Tabs defaultValue='ko'>
          <TabsList className='grid w-full grid-cols-3'>
            <TabsTrigger value='ko'>한국어 (KO)</TabsTrigger>
            <TabsTrigger value='ja'>日本語 (JA)</TabsTrigger>
            <TabsTrigger value='en'>English (EN)</TabsTrigger>
          </TabsList>

          {['ko', 'ja', 'en'].map((lang) => (
            <TabsContent key={lang} value={lang} className='space-y-4 pt-4'>
              <input
                {...form.register(`translations.${lang}.title`)}
                placeholder={`${lang.toUpperCase()} Project Title`}
                className='w-full text-2xl font-bold border-b p-2 outline-none focus:border-blue-500'
              />
              <textarea
                {...form.register(`translations.${lang}.overview`)}
                placeholder='Overview description...'
                className='w-full h-32 p-3 border rounded-md'
              />
              {/* Role, Company, Region 등 추가 필드 */}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className='col-span-12 flex justify-end'>
        <button
          type='submit'
          className='bg-blue-600 text-white px-8 py-3 rounded-lg font-bold'
        >
          프로젝트 저장하기 (Gate Open!)
        </button>
      </div>
    </form>
  );
}
