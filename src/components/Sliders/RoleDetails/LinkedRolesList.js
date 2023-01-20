import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import ListGroup from 'react-bootstrap/ListGroup'

export const RoleDetails = ({
  linkedPolicies,
  ...props
}) => {
  const { t } = useTranslation()
  return (<>
    <ListGroup className='' as="ol" numbered>
      {
        linkedPolicies.map((policy, index) => {
          return (
            <ListGroup.Item as="li" className="d-flex justify-content-between align-items-start" key={index}>
              <div className="ms-2 me-auto">
                <div>{policy.name}</div>
                {/* <small>{policy.sub}</small> */}
              </div>
              {/* <Badge bg="primary" pill>
              {policy.count}
              </Badge> */}
            </ListGroup.Item>
          )
        })
      }
    </ListGroup>
  </>
  )
}

export default RoleDetails
