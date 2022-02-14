import React from 'react'
import ContainerStyle from '../styles/GraphContainer.module.css'

export default function GraphContainer() {
  return (
    <div className={ContainerStyle.container}>
        <div className={ContainerStyle.graph}></div>
        <div className={ContainerStyle.info}></div>
    </div>
  )
}
