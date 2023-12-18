import { useRef, forwardRef, useImperativeHandle } from 'react';
import style from './index.module.scss';
import { createPortRect } from '@/utils/generator';

const graphGenerateNodes = [
    {
        type: 'rect',
        style: `${style['dnd-rect']}`,
        label: 'rect',
    },
];

const GraphDnd = forwardRef((props, ref) => {
    const dndContainerRef = useRef();

    useImperativeHandle(ref, () => {
        return dndContainerRef.current;
    });
    const startDrag = (e) => {
        const target = e.currentTarget;
        const type = target.getAttribute('data-type');
        const nodesMap = {
            rect: () =>
                props.graph.current.createNode(
                    createPortRect({
                        label: 'Rect',
                    })
                ),
            circle: () =>
                props.graph.current.createNode({
                    width: 60,
                    height: 60,
                    shape: 'circle',
                    label: 'Circle',
                    attrs: {
                        body: {
                            stroke: '#8f8f8f',
                            strokeWidth: 1,
                            fill: '#fff',
                        },
                    },
                }),
        };
        const node = nodesMap[type]();

        props.startDrag(e, node);
    };
    return (
        <div
            className={style.dnd_wrap}
            ref={dndContainerRef}
        >
            {graphGenerateNodes.map((item) => (
                <div
                    className={style['dnd-item']}
                    key={item.type}
                >
                    <div
                        data-type={item.type}
                        className={item.style}
                        onMouseDown={startDrag}
                    >
                        {item.label}
                    </div>
                </div>
            ))}
        </div>
    );
});

export default GraphDnd;
