import React from 'react';
import { Tag } from 'antd';
const { CheckableTag } = Tag;

const tagsFromServer = ['admin', 'reviewer'];

class PermissionScopeTag extends React.Component {
    state = {
        value: [],
    };

    componentDidMount() {
        this.setState({ value: this.props.value});
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ value: nextProps.value });
    }

    handleChange(tag, checked) {
        const { onChange } = this.props;
        // const nextSelectedTags = checked ?
        //     [...value, tag] :
        //     value.filter(t => t !== tag);
        // this.setState({ value: nextSelectedTags });

        const nextSelectedTags = [tag];

        onChange && onChange(nextSelectedTags);
    }

    render() {
        const { value } = this.state;
        return (
            <div>
                {tagsFromServer.map(tag => (
                    <CheckableTag
                        key={tag}
                        checked={value.indexOf(tag) > -1}
                        onChange={checked => this.handleChange(tag, checked)}
                    >
                        {tag}
                    </CheckableTag>
                ))}
            </div>
        );
    }
}
export default PermissionScopeTag;