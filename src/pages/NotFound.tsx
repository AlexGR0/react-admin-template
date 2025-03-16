import React from 'react';
import styles from '@pages/NotFound.module.scss';
import { useNavigate } from 'react-router-dom';

const NotFound: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className={`${styles['contain']}`}>
      <div className={`${styles['num']}`}>404</div>
      <div className={`${styles['text']}`}>您所访问的页面不存在</div>
      <div
        className={`${styles['btn']}`}
        onClick={() => navigate('/home/index', { replace: true })}
      >
        返回首页
      </div>
    </div>
  );
};

export default NotFound;
