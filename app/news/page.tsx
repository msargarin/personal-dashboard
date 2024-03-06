import { NewsList } from "@/app/news/components";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
};

export default function News() {
  return (
    <main>
      <NewsList showCategories={true} />
    </main>
  )
}
