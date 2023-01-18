import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faLinkSimple } from '@fortawesome/pro-light-svg-icons';
import Col from 'react-bootstrap/Col'
import Row from 'react-bootstrap/Row'
import Badge from 'react-bootstrap/Badge'
import { Button } from 'react-bootstrap'
import ListGroup from 'react-bootstrap/ListGroup'

export const RoleDetails = ({
  linkedPolicies,
  ...props
}) => {
  const { t } = useTranslation()
  console.log('linkedPolicies', linkedPolicies)

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
    {/* <Col className='col-6'>
      <Row>
        <div className="d-grid gap-2">
          <Button variant='primary-tone' size='lg'>
            <small><FontAwesomeIcon icon={faLinkSimple}/> Link Policies</small>
          </Button>
        </div>
      </Row>
    </Col> */}
  </>
  )
}

export default RoleDetails
