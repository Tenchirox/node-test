import mongoose from "mongoose";


const formateurSchema = new mongoose.Schema({
    id: { 
        type: Number, 
        required: true, 
        unique: true 
    },
    nom: {
        type:   String,
        required: true, 
        minlenght: 3 
        },
    competences: {
        type: [String],
         required: true 
        },
}, {timestamps: true });

const Formateur = mongoose.model('Formateur', formateurSchema);

export default Formateur;

