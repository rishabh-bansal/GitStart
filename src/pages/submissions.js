import React from 'react'
import Link from 'gatsby-link'
import Card from '../components/userCard'

const Submission = ({data}) => (
  <div className="card-container">
    {
      data.allMarkdownRemark.edges.map(profile => {
        return <Card username={profile.node.frontmatter.username}
                      fullname={profile.node.frontmatter.fullname}/>
      })
    }
  </div>
)

export default Submission


export const profileQuery = graphql`
  query profiles{
    allMarkdownRemark(sort: {fields:[frontmatter___fullname] order: ASC}) {
      edges {
        node {
          frontmatter {
            username
            fullname
          }
        }
      }
    }
  }
`