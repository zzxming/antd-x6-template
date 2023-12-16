import { Snapline } from '@antv/x6-plugin-snapline';
import { Dnd } from '@antv/x6-plugin-dnd';

export const registrySnapline = (graphInstance) => {
    graphInstance.use(
        new Snapline({
            enabled: true,
            sharp: true,
        })
    );
};

export const registryDnd = (graphInstance, dndContainer, validateNode) => {
    return new Dnd({
        target: graphInstance,
        scaled: false,
        dndContainer, // 再此 dom 节点放开鼠标不会放置节点
        validateNode,
    });
};
