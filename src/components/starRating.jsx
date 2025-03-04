export default function StarRating({ rating }) {
    const widthPer=rating.toFixed(1)*10
  
    return (
    <div className="stars">
        <div style={{width:`${widthPer}%`}} className="filledStars">
        </div>
        <p style={{float: 'inline-end'}}>({rating.toFixed(1)})</p>
    </div>
    );
  }
  
  
