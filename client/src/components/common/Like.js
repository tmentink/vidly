import React from 'react'

const Like = ({ liked, onClick }) => {
  let classes = 'fa fa-heart'
  if (!liked) classes += '-o'

  return (
    <i
      aria-hidden="true"
      className={classes}
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    />
  )
}

export default Like
