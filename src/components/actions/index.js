import React from 'react';
import './index.css';

import { observer } from 'mobx-react-lite';
import { RightArrowSVG } from '../svgs/icon';

import statusStore from '../../store/slider';
import actionsStore from '../../store/actions';
import { getLocalImage } from '../../utils';

const ActionList = observer(({ actions, onClickAction, style }) => {
  const { pointer } = statusStore;
  const { y, openIndex } = actionsStore;

  return (
    <>
      <div
        style={style}
        className='actions cursor-default foxai-shadow overflow-hidden bg-white rounded-[10px] py-[8px]'
      >
        <div
          className='primary-items foxai-scroll overflow-auto max-h-[320px] bg-[white] text-[var(--black)] w-[225px]'
        >
          <ul className='outline-none list-none px-[0]'>
            {actions && actions.map((item, index) => {
              switch (item.type) {
                case "hr":
                  return (
                    <li key={index} className='hr list-none'>
                      <div className='text-[13px] px-[20px] py-[3px] text-[#6e6e73]'>{item.title}</div>
                    </li>
                  )
                default:
                  return (
                    <ActionItem key={index} {...item} index={index} onClickAction={onClickAction} />
                  )
              }
            })}
          </ul>
        </div>

        <div
          style={{ top: `${y - pointer.y}px` }}
          className='sub-items absolute foxai-scroll left-[225px] foxai-shadow overflow-auto max-h-[233px] bg-[white] text-[var(--black)] w-[180px] rounded-[10px]'
        >
          {actions && actions.map((item, index) => {
            if (item.type === "list") {
              return <div
                key={index}
                className='subitems-wrapper'
                onMouseLeave={() => actionsStore.setOpenIndex(-1)}
                style={{ display: openIndex === index ? "block" : "none" }}
              >
                {
                  item.list && item.list.map((item, i) => {
                    return <ActionSubItem key={i} {...item} index={i} onClickAction={onClickAction} />
                  })
                }
              </div>
            }
          })}
        </div>

      </div>
    </>
  )
});

export default ActionList;

const BaseItem = observer(({ title, icon, type }) => {
  return (
    <>
      <div className='action-item px-[20px] py-[3px] hover:bg-[#f3f3f3]'>
        <div className='item flex flex-row items-center justify-between'>
          <div className='header flex flex-row items-center'>
            {icon && <div className='flex items-center mr-[12px]'>
              <img className='h-[16px] w-[16px]' src={getLocalImage(icon)} alt={title} />
            </div>
            }
            <div className='action-title'>{title}</div>
          </div>
          {
            type === "list" &&
            <div className='icon flex items-center'>
              <RightArrowSVG size={16} />
            </div>
          }
        </div>
      </div>
    </>
  )
});


const ActionItem = observer(({ title, icon, type, index, onClickAction }) => {
  const { setY, setOpenIndex } = actionsStore;
  return (
    <>
      <li
        key={index}
        onClick={() => {
          if (type === "list") return;
          onClickAction && onClickAction(type);
        }}
        onMouseEnter={(e) => {
          if (type !== "list") {
            setOpenIndex(index);
            return;
          };
          const { y } = e.target.getBoundingClientRect();
          const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
          setY(scrollTop + y);
          setOpenIndex(index);
        }}
        className='action w-full list-none text-[14px] text-[#2d2d2d]'
      >
        <BaseItem title={title} icon={icon} type={type} />
      </li>
    </>
  )
});

const ActionSubItem = observer(({ title, icon, type, index, onClickAction }) => {
  return (
    <>
      <li
        key={index}
        onClick={() => {
          if (type === "list") return;
          onClickAction && onClickAction(type);
        }}
        className='action w-full list-none text-[14px] text-[#2d2d2d]'
      >
        <BaseItem title={title} icon={icon} type={type} />
      </li>
    </>
  )
});