import Main from '@/components/main/Main';
import Footer from '@/components/footer/Footer';

export default function Home() {
  return (
    <div className='min-h-screen flex flex-col'>
      <div className='flex-1 flex flex-col items-center justify-center'>
        <Main />
      </div>
      <Footer />
    </div>
  );
}
