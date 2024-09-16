const jwt= require('jsonwebtoken');
const authenticateJWT= (req, res, next) => {
    const authHeader= req.headers.authorization;    
    const token= authHeader && authHeader.split(' ')[1];

    if(token) {
        jwt.verify(token,process.env.JWT_SECRET, (err,user)=> {
            if(err) {
                console.log("JWT verification error", err);
                return res.status(403).json({message: 'Invalid or expired token'});
            }
            req.user= user;
            console.log(req.user);
            next();
        });
    }
    else {
        console.log("no token provided");
        res.status(401).json({message:'No token provided'});
    }
}

module.exports= authenticateJWT;