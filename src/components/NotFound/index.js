import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <>
    <div className="not-found-container">
      <img
        src="https://res.cloudinary.com/dt1l3pjk4/image/upload/v1674822987/Group_7484_p07t2c.png"
        alt="not found"
        className="not-found-image"
      />
      <h1 className="not-found-heading">Page Not Found</h1>
      <p className="not-found-description">
        we are sorry, the page you requested could not be found, Please go back
        to the homepage
      </p>
      <Link to="/" className="go-back-home-link">
        <button type="button" className="go-back-btn">
          Go Back to Home
        </button>
      </Link>
    </div>
  </>
)
export default NotFound
