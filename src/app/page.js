import GraphComponent from '@/components/GraphComponent';
import { createPortRect } from '@/utils/generator';

const nodes = [
    createPortRect({
        id: 'node1',
        x: 40,
        y: 40,
        label: 'hello',
    }),
    createPortRect({
        id: 'node2',
        shape: 'rect',
        x: 160,
        y: 180,
        label: 'world',
    }),
    createPortRect({
        shape: 'rect',
        x: -120,
        y: 10,
        label: '',
    }),
];
const edges = [
    {
        shape: 'edge',
        source: 'node1',
        target: 'node2',
        label: 'x6',
    },
];
const data = {
    nodes,
    edges,
};
export default function Home() {
    return (
        <main className="relative flex w-screen min-h-screen flex-col items-center justify-between p-4">
            <GraphComponent data={data} />
        </main>
    );
}
