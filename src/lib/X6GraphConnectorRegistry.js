import { Point, Graph, Path } from '@antv/x6';

// 波浪线
Graph.registerConnector(
    'wavy',
    (sourcePoint, targetPoint, vertices, args) => {
        // console.log(sourcePoint, targetPoint, vertices, args);
        let { x: startX, y: startY } = sourcePoint;
        let { x: endX, y: endY } = targetPoint;

        // 定义固定的参数
        const amplitude = 5;
        const segmentLength = 20;
        const startStraightSegmentLength = 10;
        // 计算起始点和结束点之间的距离和角度
        const deltaX = endX - startX;
        const deltaY = endY - startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const angle = Math.atan2(deltaY, deltaX);

        // 调整距离以包含直线段
        const adjustedDistance = distance - 2 * startStraightSegmentLength;
        const frequency = Math.floor(adjustedDistance / segmentLength);

        const start = Point.create(startX, startY);
        const path = new Path();
        path.appendSegment(Path.createSegment('M', start));

        // 添加起始直线段
        startX += Math.cos(angle) * startStraightSegmentLength;
        startY += Math.sin(angle) * startStraightSegmentLength;
        path.lineTo(startX, startY);

        // 循环添加波浪段
        for (let i = 0; i < frequency; i++) {
            const waveMidX = startX + Math.cos(angle) * segmentLength * (i + 0.5);
            const waveMidY = startY + Math.sin(angle) * segmentLength * (i + 0.5);

            const cp1x = waveMidX - amplitude * Math.sin(angle);
            const cp1y = waveMidY + amplitude * Math.cos(angle);

            const cp2x = waveMidX + amplitude * Math.sin(angle);
            const cp2y = waveMidY - amplitude * Math.cos(angle);

            const segmentEndX = startX + Math.cos(angle) * segmentLength * (i + 1);
            const segmentEndY = startY + Math.sin(angle) * segmentLength * (i + 1);

            path.curveTo(cp1x, cp1y, cp2x, cp2y, segmentEndX, segmentEndY);
        }

        // 添加结束直线段
        path.lineTo(endX, endY);

        return path;
    },
    true
);
