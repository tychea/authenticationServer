## generate secret key

1. open terminal:
   - run node `node`
   - run crypto library
     ```
     require('crypto').randomBytes(64).toString('hex')
     ```
