import styles from './video-layout.module.css';

import {Captions, ChapterTitle, Controls, Gesture, useMediaState,} from '@vidstack/react';

import * as Buttons from './shared/buttons';
import * as Menus from './shared/menus';
import * as Sliders from './shared/sliders';
import {TimeGroup} from './shared/time-group';
import {Input} from "antd";
import {useStore} from "../store";

export interface VideoLayoutProps {
    thumbnails?: string;
}

export function VideoLayout({thumbnails}: VideoLayoutProps) {
    const store = useStore()

    return (
        <>
            <Gestures/>
            <Captions className={`${styles.captions} vds-captions`}/>
            {store.login && <Controls.Root className={`${styles.controls} vds-controls`}>
                <Controls.Group className={`${styles.controlsGroupTop} vds-controls-group`}>
                    <div style={{color: '#fff'}}>{store?.currentProduct?.episodeTitle}</div>
                    {/*<div>*/}
                    {/*    <Input style={{width: 200}} placeholder={'请输入弹幕内容'}/>*/}
                    {/*</div>*/}
                    <div className="vds-controls-spacer"/>

                    {/*<Buttons.Caption tooltipPlacement="top" />*/}

                    {/*<Buttons.Chat tooltipPlacement="top"/>*/}
                    <Menus.List placement="bottom end" tooltipPlacement="bottom"/>
                    <Menus.Chapters placement="bottom end" tooltipPlacement="bottom"/>

                    {/*<Buttons.PIP tooltipPlacement="top"/>*/}
                    {/*<Buttons.Fullscreen tooltipPlacement="top end"/>*/}
                </Controls.Group>


                <div className="vds-controls-spacer"/>
                <Controls.Group className={`${styles.controlsGroup} vds-controls-group`}>
                    <Sliders.Time thumbnails={thumbnails}/>
                </Controls.Group>

                <Controls.Group className={`${styles.controlsGroup} vds-controls-group`}>
                    <Buttons.Play tooltipPlacement="top start"/>
                    <Buttons.Mute tooltipPlacement="top"/>
                    <Sliders.Volume/>
                    <TimeGroup/>
                    <ChapterTitle className="vds-chapter-title"/>

                    {/*<div>*/}
                    {/*    <Input placeholder={'请输入弹幕内容'}/>*/}
                    {/*</div>*/}
                    <div className="vds-controls-spacer"/>

                    {/*<Buttons.Caption tooltipPlacement="top" />*/}

                    {/*<Buttons.Chat tooltipPlacement="top"/>*/}
                    {/*<Menus.List placement="top end" tooltipPlacement="top"/>*/}
                    {/*<Menus.Chapters placement="top end" tooltipPlacement="top"/>*/}

                    <Buttons.PIP tooltipPlacement="top"/>
                    <Buttons.Fullscreen tooltipPlacement="top end"/>
                </Controls.Group>
            </Controls.Root>}
        </>
    );
}

function Gestures() {
    return (
        <>
            <Gesture className={styles.gesture} event="pointerup" action="toggle:paused"/>
            <Gesture className={styles.gesture} event="dblpointerup" action="toggle:fullscreen"/>
            <Gesture className={styles.gesture} event="pointerup" action="toggle:controls"/>
            <Gesture className={styles.gesture} event="dblpointerup" action="seek:-10"/>
            <Gesture className={styles.gesture} event="dblpointerup" action="seek:10"/>
        </>
    );
}
