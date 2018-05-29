import React from 'react';
import BlockpassLogo from './blockpass-logo.png';
import { PropTypes } from 'prop-types';
import InfinitoLogo from './infinito-wallet-logo.png';
import './index.scss';

const Logo = ({type='left'}) => {
    return (
        <div className={`logo__wrapper ${type==="left" ? "left" : "right"}`}>
            <div 
                alt="title" 
                className="logo__img"
                style={{
                    "backgroundImage": `url(${type==="left" ? BlockpassLogo : InfinitoLogo})`,
                    "backgroundSize": "cover",
                    "backgroundPosition": "center",
                    }}
            />
        </div>
    )
}

Logo.propTypes = {
    /** position of logo on header (left -right) */
    type: PropTypes.string.isRequired,
  };

export default Logo;