import { Radio } from 'antd';
import Icon, { LineOutlined, DashOutlined } from '@ant-design/icons';
import Wave from '@/assets/svg/wave.svg';

import style from './index.module.scss';

const lines = [
    {
        value: '',
        icon: <LineOutlined />,
    },
    {
        value: 'dash',
        icon: <DashOutlined />,
    },
    {
        value: 'wave',
        icon: <Icon component={Wave} />,
    },
];

const EdgeAttrs = ({ lineType, lineTypeChange, lineColor, lineColorChange }) => {
    return (
        <>
            <Radio.Group
                value={lineType}
                onChange={(e) => lineTypeChange(e.target.value)}
            >
                {lines.map((line) => (
                    <Radio.Button
                        key={line.value}
                        className={style.line_btn}
                        value={line.value}
                    >
                        {line.icon}
                    </Radio.Button>
                ))}
            </Radio.Group>
            <input
                type="color"
                value={lineColor}
                onChange={(e) => lineColorChange(e.target.value)}
            />
        </>
    );
};

export default EdgeAttrs;
