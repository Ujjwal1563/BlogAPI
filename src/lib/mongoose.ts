import mongoose, { Connection } from 'mongoose';
import config from '@/config'
import type{ConnectOptions} from 'mongoose';

const clientOptions:ConnectOptions ={
    dbName:'blog-db',
    appName:'Blog API',
    serverApi:{
        version:'1',
        strict:true,
        deprecationErrors:true,
    },
};

export const connectToDatabase = async():Promise<void>=>{
    if(!config.MONGO_URI){
        throw new Error('MongoDB URI is not defined in the configuration');
    }
    try {
        await mongoose.connect(config.MONGO_URI,clientOptions);
        console.log('Connected to the database successfully ',{
            uri:config.MONGO_URI,
            options:clientOptions,
        })
    }
    catch(err){
        if(err instanceof Error){
            throw err;
        }
        console.log('Error connectiong to the database',err);
    }
};
export const diconnectFromDatabase = async():Promise<void>=>{
    try{
        await mongoose.disconnect();
        console.log('Disconnected from the database successfully.',{
            uri:config.MONGO_URI,
            options:clientOptions
        });
    }
    catch(err){
        if(err instanceof Error){
            throw new Error(err.message);
        }
        console.log('Error disconnecting from the database',err);
    }
}
