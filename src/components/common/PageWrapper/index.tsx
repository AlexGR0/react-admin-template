import React from 'react';
import { Outlet } from 'react-router-dom';
import { routes } from '@routes/index';
import Menu from '@components/Menu';
import Breadcrumb from '@components/Breadcrumb';
import NavDropdown from '@components/NavDropdown';
import RatioImage from '@components/common/RatioImage';
import CommonIcon from '@components/common/CommonIcon';
import styles from '@components/common/PageWrapper/styles.module.scss';
import LogoImg from '@assets/images/logo.png';
import { useSelector, useDispatch } from 'react-redux';
import { Button } from 'antd';
import { FormattedMessage } from 'react-intl';

const PageWrapper: React.FC = () => {
  const { menuCollapsed, locale } = useSelector((state: any) => state.global);
  const dispatch = useDispatch();

  return (
    <div className={`${styles['page-panel']}`}>
      <div className={`${styles['page-container']}`}>
        <div
          className={`${styles['sliders']}`}
          style={{ flexBasis: menuCollapsed ? 'auto' : '17%' }}
        >
          <div className={`${styles['logo-box']}`}>
            <RatioImage src={LogoImg} round width={30} />
            {!menuCollapsed && (
              <div className={`${styles['logo-text']}`}>
                <FormattedMessage id="react后台系统模板" />
              </div>
            )}
          </div>
          <div className={`${styles['menu']}`}>
            <Menu routes={routes} />
          </div>
        </div>
        <div className={`${styles['content']}`}>
          <header className={`${styles['header']}`}>
            <div className={`${styles['header-left']}`}>
              <CommonIcon
                onClick={() => dispatch({ type: 'global/menuCollapsedToggle' })}
                type={`icon-${!menuCollapsed ? 'lanmushouqi' : 'lanmuzhankai'}`}
                size={20}
                style={{ marginRight: 10, cursor: 'pointer' }}
              />
              <Breadcrumb routes={routes} />
            </div>
            <div className={`${styles['header-right']}`}>
              <Button
                onClick={() => dispatch({ type: 'global/localeToggle' })}
                icon={<CommonIcon type={`icon-language-${locale}`} size={20} />}
                type="text"
              />
              <NavDropdown>
                <Button icon={<RatioImage width={20} round />} type="text" />
              </NavDropdown>
            </div>
          </header>
          <main className={`${styles['main']}`}>
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default PageWrapper;
