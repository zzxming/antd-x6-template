import { ColorPicker } from 'antd';

const MyColorPicker = ({ children, value, onChange }) => {
    return (
        <ColorPicker
            value={value}
            onChange={(_, c) => onChange(c)}
        >
            {children}
        </ColorPicker>
    );
};

export default MyColorPicker;
