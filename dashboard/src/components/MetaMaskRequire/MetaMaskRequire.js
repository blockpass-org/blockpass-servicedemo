import React from 'react';
import missingMetaMask from "./missing.png";

const defaultStyle = {
    maxWidth: 200
}

class MetaMaskRequire extends React.PureComponent {
    render() {
        const { isReady, style, children} = this.props;

        return <div>
            {!isReady && 
                <a href="https://metamask.io/">
                <img src={missingMetaMask} style={style || defaultStyle} alt="Missing Metamask" />
                </a>
            }
            {isReady && <div>
                {children}
            </div>}
        </div>
    }
}

export default MetaMaskRequire;