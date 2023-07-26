import { useEffect, useState } from 'react';
import styles from './stickyHeader.module.css';
import groupIcon from '../../assets/imgs/groupIcon.png';
import { useLocation } from 'react-router-dom';
import Global from 'global/global';


export default function StickyHeader() {
  const [profileIcon, setProfileIcon] = useState(
    'https://i.scdn.co/image/ab67757000003b82ae8c728abc415a173667ff85'
  );

  const [visibleBackground, setVisibleBackground] = useState({});

  const handleScroll = () => {
    if (window.scrollY > 200) {
      setVisibleBackground({
        backgroundColor: 'var(--sticky-header-blue)',
        marginTop:'0',
      });
    }else if(window.scrollY > 150) {
      setVisibleBackground({
        backgroundColor: 'var(--sticky-header-blue)',
        marginTop:'0',
        opacity:'0.7'
      });
    }
    else if(window.scrollY > 100) {
      setVisibleBackground({
        backgroundColor: 'var(--sticky-header-blue)',
        marginTop:'0',
        opacity:'0.5',
      });
    } else {
      setVisibleBackground({});
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);


  const handleGoingBackArrows = () => {

    window.electron.loadPreviousUrl.sendMessage('load-previous-url')

  }

  const handleGoingForwardArrows = () => {

    window.electron.loadForwardUrl.sendMessage('load-forward-url')

  }

  const location = useLocation();

  const [arrowState, setArrowState] = useState<Global.HandleUrlChangeResponse>({
    canGoBack: false,
    canGoForward: false,
  });

  const handleUrlChange = async () => {
    try {
      let response = await window.electron.handleUrlChange.sendMessage('handle-url-change');
      let responseObj : Global.HandleUrlChangeResponse = {canGoBack:response.canGoBack,canGoForward:response.canGoForward}
      setArrowState(responseObj)
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    handleUrlChange();
  }, [location]);


  const [backArrowStyle, setBackArrowStyle] = useState('')
  const [forwardArrowStyle, setForwardArrowStyle] = useState('')


  useEffect(() => {

    setBackArrowStyle( !arrowState.canGoBack ? styles.arrowOpacity : '')
    setForwardArrowStyle( !arrowState.canGoForward ? styles.arrowOpacity : '')

  }, [arrowState])


  return (
    <header
      style={visibleBackground}
      className={`d-flex flex-row justify-content-space-evenly ${styles.wrapperStickyHeader}`}
    >
      <div
        className={`d-flex flex-row container-fluid ${styles.wrapperDirectionArrows}`}
      >
        <button onClick={handleGoingBackArrows}>
          <i className={`fa-solid fa-chevron-left ${backArrowStyle}`}></i>
        </button>
        <button onClick={handleGoingForwardArrows}>
        <i className={`fa-solid fa-chevron-right ${forwardArrowStyle}`}></i>
        </button>
      </div>

      <div
        className={`d-flex flex-row container-fluid  ${styles.wrapperProfileOptions}`}
      >
        <button>
          <img src={profileIcon} alt="" />
        </button>

        <button>
          <img className={`${styles.groupIcon}`} src={groupIcon} alt="" />
        </button>
      </div>
    </header>
  );
}