import {
    Menu,
    Tooltip,
    useCaptionOptions,
    type MenuPlacement,
    type TooltipPlacement, useMediaState,
} from '@vidstack/react';
import {
    ChaptersIcon,
    ChevronLeftIcon,
    ChevronRightIcon, SearchIcon,
} from '@vidstack/react/icons';
import React, {useEffect, useState, useContext} from "react";
import request from "../../utils/request";
import {AutoComplete, Button, Input, Space} from 'antd'
import {SearchOutlined} from '@ant-design/icons'
import {useStore} from "../../store";

export interface SettingsProps {
    placement: MenuPlacement;
    tooltipPlacement: TooltipPlacement;
}

export function List({placement, tooltipPlacement}: SettingsProps) {
    const [list, setList] = useState([])
    const {setStore, ...store} = useStore();
    const [value, setValue] = useState('')
    const [options, setOptions] = useState([])

    const initial = () => {
        request.post("/api/play_record/v1/page", {
            page: 1,
            size: 50,
        }).then(res => {
            // console.log(res.data.data)
            setList(res.data.data.current_data || [])
            setStore({currentProduct: res.data.data.current_data[0]})
        })
    }
    useEffect(() => {
        initial()
    }, []);

    return (
        <Menu.Root className="vds-menu">
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Menu.Button className="vds-menu-button vds-button">
                        <SearchIcon className="vds-rotate-icon"/>
                    </Menu.Button>
                </Tooltip.Trigger>
                <Tooltip.Content className="vds-tooltip-content" placement={tooltipPlacement}>
                    我的课程
                </Tooltip.Content>
            </Tooltip.Root>

            <Menu.Content className="vds-menu-items" placement={placement} style={{minHeight: 200}}>
                <Menu.RadioGroup className="vds-radio-group" value={store?.currentProduct?.productId}>
                    {/*<Menu.Radio className="vds-radio" value={""}>*/}
                    <Space style={{
                        width: "calc( 100% + 20px)",
                        position: 'sticky',
                        top: -10,
                        marginTop: -10,
                        marginLeft: -10,
                        backgroundColor: '#222',
                        zIndex: 99
                    }}>
                        <AutoComplete
                            // popupMatchSelectWidth={252}
                            getPopupContainer={node => node.parentElement}
                            style={{width: 400, marginLeft: 15, marginTop: 10, marginBottom: 10}}
                            options={options}
                            onSelect={(value: string, option: any) => {
                                // console.log('onSelect', value, option);
                                request.post("/api/search/v1/recommend", {
                                    "page": 1,
                                    "size": 12,
                                    "title": option.title
                                }).then(res => {
                                    // console.log(res.data.data?.current_data)
                                    setList(res.data.data?.current_data?.map((i: any) => ({
                                        ...i,
                                        productId: i?.id
                                    })) || [])
                                })
                            }}
                            onSearch={(val) => {
                                request('/api/search/v1/hit_title?title=' + val).then(res => {
                                    setOptions(res.data.data?.map((i: any) => ({
                                        ...i,
                                        label: i?.title,
                                        value: i?.title
                                    })))
                                })
                            }}
                            size="large"
                            allowClear
                            suffixIcon={<SearchOutlined  />}
                            onClear={() => {
                                initial()
                            }}
                        >
                            <Input style={{width: 400}} placeholder={'输入课程名称搜索'}/>
                        </AutoComplete>


                    </Space>

                    <div style={{height: 10}}></div>
                    {/*</Menu.Radio>*/}
                    {list?.map((item: any) => {
                            const {productTitle, productId, id, title} = item
                            return <Menu.Radio
                                className="vds-radio" value={productId}
                                onSelect={(data) => {
                                    // console.log(data, id, productId)

                                    setStore({
                                        currentProduct: {
                                            ...item,
                                        }
                                    })
                                }} key={id}>
                                <div className="vds-radio-check"/>
                                <span className="vds-radio-label">{productTitle || title}</span>
                            </Menu.Radio>
                        }
                    )}
                </Menu.RadioGroup>
            </Menu.Content>
        </Menu.Root>
    );
}

export function Chapters({placement, tooltipPlacement}: SettingsProps) {
    const [list, setList] = useState([])
    const store = useStore()

    useEffect(() => {
        request.get(`/api/chapter/v1/list?productId=${store?.currentProduct?.productId}`).then(res => {
            setList(res.data.data || [])
            const first = res.data.data?.[0]?.episodeList?.[0]
            // console.log(store?.currentProduct)
            request.post('/api/product/v1/get_play_url', {
                "vodType": "HWYUN",
                "productId": first?.productId,
                "episodeId": store?.currentProduct?.currentEpisodeId || first?.id
            }).then(res => {
                store.setStore({
                    currentPlay: res.data.data
                })
            })
        })
    }, [store?.currentProduct?.productId]);

    if (!store?.currentProduct?.productId) return null

    return (
        <Menu.Root className="vds-menu">
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <Menu.Button className="vds-menu-button vds-button">
                        <ChaptersIcon className="vds-rotate-icon"/>
                    </Menu.Button>
                </Tooltip.Trigger>
                <Tooltip.Content className="vds-tooltip-content" placement={tooltipPlacement}>
                    选集
                </Tooltip.Content>
            </Tooltip.Root>
            <Menu.Content className="vds-menu-items" placement={placement}>
                {list.map((item: any, index) => <ChapterSubmenu index={index} {...item} key={item.id}/>)}
            </Menu.Content>
        </Menu.Root>
    );
}

function ChapterSubmenu(props: any) {
    const {setStore} = useStore()

    return (
        <Menu.Root>
            <SubmenuButton
                label={`第${props.index + 1}章 ` + props?.title}
                // hint={'off'}
                disabled={props.disabled}
                icon={ChaptersIcon as any}
            />
            <Menu.Content className="vds-menu-items">
                <Menu.RadioGroup className="vds-radio-group" value={props.selectedValue}>
                    {props?.episodeList?.map(({title, productId, id}: any) => (
                        <Menu.Radio className="vds-radio" value={id} onSelect={(data) => {
                            // console.log(data, id, productId)

                            request.post('/api/product/v1/get_play_url', {
                                "vodType": "HWYUN",
                                "productId": productId,
                                "episodeId": id
                            }).then(res => {
                                setStore({
                                    currentPlay: res.data.data
                                })
                            })
                        }} key={id}>
                            <div className="vds-radio-check"/>
                            <span className="vds-radio-label">{title}</span>
                        </Menu.Radio>
                    ))}
                </Menu.RadioGroup>
            </Menu.Content>
        </Menu.Root>
    );
}

export interface SubmenuButtonProps {
    label: string;
    // hint: string;
    disabled?: boolean;
    icon: any;
}

function SubmenuButton({label, icon: Icon, disabled}: SubmenuButtonProps) {
    return (
        <Menu.Button className="vds-menu-button" disabled={disabled}>
            <ChevronLeftIcon className="vds-menu-button-close-icon"/>
            <Icon className="vds-menu-button-icon"/>
            <span className="vds-menu-button-label">{label}</span>
            <span className="vds-menu-button-hint" style={{width: 6}}></span>
            <ChevronRightIcon className="vds-menu-button-open-icon"/>
        </Menu.Button>
    );
}
