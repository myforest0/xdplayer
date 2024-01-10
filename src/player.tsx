import '@vidstack/react/player/styles/default/theme.css';

import {useEffect, useRef, useState} from 'react';

import styles from './player.module.css';

import {
    isHLSProvider,
    MediaPlayer,
    MediaProvider,
    Poster,
    type MediaCanPlayDetail,
    type MediaCanPlayEvent,
    type MediaPlayerInstance,
    type MediaProviderAdapter,
    type MediaProviderChangeEvent,
    type MediaViewType, DefaultVideoLayout,
} from '@vidstack/react';

import {VideoLayout} from './layouts/video-layout';
import CheckLogin from "./components/CheckLogin";
import {Provider} from "./store";
import {defaultLayoutIcons} from "@vidstack/react/player/layouts/default";

export function Player() {
    const [state, setStore] = useState(JSON.parse(window.localStorage.getItem('store') || "{}") || {})
    const player = useRef<MediaPlayerInstance>(null);
    const [viewType, setViewType] = useState<MediaViewType>('unknown');

    useEffect(() => {
        // Initialize src.

        // Subscribe to state updates.
        return player.current!.subscribe(({paused, viewType}) => {
            // console.log('is paused?', '->', paused);
            setViewType(viewType);
        });

    }, []);

    function onProviderChange(
        provider: MediaProviderAdapter | null,
        nativeEvent: MediaProviderChangeEvent,
    ) {
        // We can configure provider's here.
        if (isHLSProvider(provider)) {
            provider.config = {};
        }
    }

    // We can listen for the `can-play` event to be notified when the player is ready.
    function onCanPlay(detail: MediaCanPlayDetail, nativeEvent: MediaCanPlayEvent) {
        // ...
    }

    function changeSource(type: string) {

    }

    return (
        <Provider value={{...state, setStore}}>
            <MediaPlayer
                className={`${styles.player} media-player`}
                title={state.currentProduct?.productTitle}
                src={state.currentPlay?.playResult || ''}
                crossorigin
                playsinline
                onProviderChange={onProviderChange}
                onCanPlay={onCanPlay}
                ref={player}
            >
                <MediaProvider>
                    <Poster
                        className={`${styles.poster} vds-poster`}
                        src="/xdplayer/hy.jpg"
                        alt="开通超级会员可全网免费观看海量在线专题课程：Java基础、数据库、JavaWeb、JavaEE前沿框架、互联网新技术……"
                    />
                </MediaProvider>
                <VideoLayout/>
            </MediaPlayer>
            <CheckLogin/>
        </Provider>
    );
}
