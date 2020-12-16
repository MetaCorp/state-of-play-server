import { redis } from "../redis"

redis.flushdb( function (err, succeeded) {
    console.log(err || succeeded); // will be true if successfull
});