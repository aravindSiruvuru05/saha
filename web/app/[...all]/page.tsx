import dynamic from 'next/dynamic';
import { lists } from '../../mock';

const App = dynamic(() => import('../../components/AppShell'), {
  ssr: false,
});

export async function generateStaticParams() {
  return [
    { all: ['feed'] },
    { all: ['signin'] },
    { all: ['signup'] },
    { all: ['home'] },
    { all: ['search-listings'] },
    { all: ['rides-home'] },
    { all: ['tabs'] },
    { all: ['/web/assets/images/images.jpeg'] },
    { all: ['lists'] },
    ...lists.map(list => ({ all: ['lists', list.id] })),
    { all: ['settings'] },
  ];
}

export default function Page() {
  return <App />;
}
