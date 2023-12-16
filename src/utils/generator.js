import { randomID } from '@/utils/generic';

const portsAttr = {
    circle: {
        r: 6,
        magnet: true,
        stroke: '#ccc',
    },
};
const portPositionArgs = {
    distance: 10,
};
let portCount = 0;
export const fourPort = () => {
    return {
        groups: {
            top: {
                position: {
                    name: 'top',
                    portPositionArgs,
                },
                attrs: portsAttr,
            },
            right: {
                position: {
                    name: 'right',
                    portPositionArgs,
                },
                attrs: portsAttr,
            },
            bottom: {
                position: {
                    name: 'bottom',
                    portPositionArgs,
                },
                attrs: portsAttr,
            },
            left: {
                position: {
                    name: 'left',
                    portPositionArgs,
                },
                attrs: portsAttr,
            },
        },
        items: [
            {
                id: `port-top_${++portCount}`,
                group: 'top',
            },
            {
                id: `port-right_${++portCount}`,
                group: 'right',
            },
            {
                id: `port-bottom_${++portCount}`,
                group: 'bottom',
            },
            {
                id: `port-left_${++portCount}`,
                group: 'left',
            },
        ],
    };
};

export const createPortRect = (options) => {
    return {
        id: `port_rect-${randomID()}`,
        shape: 'rect',
        x: 0,
        y: 0,
        width: 96,
        height: 36,
        attrs: {
            body: {
                fill: '#fff',
                stroke: '#8f8f8f',
                strokeWidth: 1,
                rx: 6,
                ry: 6,
            },
        },
        ports: fourPort(),
        ...options,
    };
};
