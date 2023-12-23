import { Radio } from 'antd';
import style from './index.module.scss';
import Icon from '@ant-design/icons';
import Text from '@/assets/svg/text.svg';
import { textEdit } from '@/assets/const/toolName';

const GraphTools = ({ value, onChange }) => {
    const changeValue = (e) => {
        onChange(value === e.target.value ? '' : e.target.value);
    };
    return (
        <div className={style.tool_control}>
            <Radio.Group
                value={value}
                onChange={changeValue}
            >
                <Radio.Button
                    value={textEdit}
                    onClick={changeValue}
                >
                    <Icon component={Text} />
                </Radio.Button>
            </Radio.Group>
        </div>
    );
};

export default GraphTools;
