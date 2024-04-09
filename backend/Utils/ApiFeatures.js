class Apifeatures{
    constructor(query, queryStr){
        this.query = query;
        this.queryStr = queryStr;
    }

    filter(){
        let queryString = JSON.stringify(this.queryStr);
        queryString = queryString.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
        const queryObj = JSON.parse(queryString);
        //console.log(queryObj);

        this.query = this.query.find(queryObj);

        return this;
    }

    sort(){
        if(this.queryStr.sort){
            
            //const sortBy = this.queryStr.sort.split(',').join(' ');
            const sortBy = this.queryStr.sort.split(',').join(' ');

            console.log(sortBy);


            const inputString = sortBy;

            // Split the input string by whitespace
            const fields = inputString.split(' ');

            // Create an object to store the sort order
            const sortOrder = {};

            // Iterate through each field in the array
            fields.forEach(field => {
                // Check if the field starts with a minus sign (-)
                if (field.startsWith('-')) {
                    // Remove the minus sign and set the field in sortOrder with value -1 (descending order)
                    sortOrder[field.substring(1)] = -1;
                } else {
                    // Set the field in sortOrder with value 1 (ascending order)
                    sortOrder[field] = 1;
                }
            });

            console.log(sortOrder);

            
            
            
            
            //console.log(sortBy);
            this.query = this.query.sort(sortOrder);
           
        }else{
            this.query = this.query.sort('-createdAt');
        }

        return this;
    }

    limitFields(){
        if(this.queryStr.fields){
            const fields = this.queryStr.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }else{
            this.query = this.query.select('-__v');
        }

        return this;
    }

    paginate(){
        const page = this.queryStr.page*1 || 1;
        const limit = this.queryStr.limit*1 || 50;
        const skip = (page -1) * limit;
        this.query = this.query.skip(skip).limit(limit);

        // if(this.queryStr.page){
        //     const moviesCount = await Movie.countDocuments();
        //     if(skip >= moviesCount){
        //         throw new Error("This page is not found!");
        //     }
        // }

        return this;
    }
}

module.exports = Apifeatures;