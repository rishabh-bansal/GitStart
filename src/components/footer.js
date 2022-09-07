import React from 'react'
import Link from 'gatsby-link'

const Footer = ({ author, profile }) => (
    <footer>
        Made with <i className="em em-heart" style={{width: '15px', height: '15px'}}></i>
        <Link to={profile}>{' @'+author}</Link>
         <button id="scrollTopBtn" title='Back to top' className='btn-scroll-top' 
               onClick={ goToTop }>
                <span >▲</span>
              </button>;
    </footer>
)

let intervalID='';

function goToTop() {
    intervalID =  setInterval(scrollSmooth, 11.1);
  }

function scrollSmooth(){
    if (window.pageYOffset === 0) {
        clearInterval(intervalID);
    }
    window.scroll(0, window.pageYOffset - 50);
}

export default Footer
