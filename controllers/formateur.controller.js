import Formateur from "../models/formateur.model.js";


export async function getAllFormateurs(req, res) {
    try {
        const formateurs = await Formateur.find();
        res.status(200).json(formateurs);
    } catch (error) {
        console.error("Erreur lors de la récupération des formateurs:", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération des formateurs." });
    }
}


export async function newFormateur(req, res) {
    const { id, nom,  competences } = req.body;
    const newFormateur = {
        id,
        nom,
        competences
    };
     await Formateur.create(newFormateur);
    res.status(201).json(newFormateur);
}


export async function updateFormateur(req, res) {
    try {
        const idFromParams = req.params.id; // Ceci est une chaîne, ex: "12"
        const { nom, competences } = req.body;

        const updateData = {};
        if (nom !== undefined) updateData.nom = nom;
        if (competences !== undefined) updateData.competences = competences;

        if (Object.keys(updateData).length === 0) {
            return res.status(400).json({ message: "Aucun champ à mettre à jour n'a été fourni." });
        }

        // --- DÉTERMINER LA BONNE CONDITION DE RECHERCHE ---

        // **IMPORTANT : Vérifiez le type du champ 'id' dans votre Schéma Mongoose.**
        // Est-il défini comme 'String' ou 'Number' ?

        let queryCondition;
        let anIdToSearch; // Pour le message d'erreur amélioré

        // Option A: Si votre champ 'id' dans le schéma est de type String
        queryCondition = { id: idFromParams };
        anIdToSearch = idFromParams;


        // Si le nom de votre champ ID n'est pas 'id' mais autre chose (ex: 'formateurId'), changez-le dans queryCondition.

        console.log(`Tentative de mise à jour avec la condition: ${JSON.stringify(queryCondition)}`); // Log pour débogage

        const formateurMisAJour = await Formateur.findOneAndUpdate(
            queryCondition,
            { $set: updateData },
            {
                new: true,
                runValidators: true,
                context: 'query'
            }
        );

        if (!formateurMisAJour) {
            // Message d'erreur amélioré pour indiquer quelle valeur a été cherchée
            return res.status(404).json({ message: `Formateur avec l'identifiant (valeur cherchée: ${anIdToSearch}, type: ${typeof anIdToSearch}) non trouvé.` });
        }

        res.status(200).json({
            message: 'Formateur mis à jour avec succès.',
            formateur: formateurMisAJour
        });

    } catch (error) {
        console.error("Erreur lors de la mise à jour du formateur:", error);
        if (error.name === 'CastError') {
            // Cela peut arriver si Mongoose essaie de convertir une valeur pour la requête
            // et que le type ne correspond pas à ce qui est défini dans le schéma pour le champ de la query.
            return res.status(400).json({ message: `Format de l'identifiant invalide ou problème de type.`, details: error.message });
        }
        if (error.name === 'ValidationError') {
            return res.status(400).json({ message: 'Données de mise à jour invalides.', errors: error.errors });
        }
        res.status(500).json({ message: 'Erreur serveur lors de la mise à jour du formateur.', error: error.message });
    }
}


export async function deleteFormateur(req, res) {
    const { id } = req.params; // L'ID récupéré des paramètres de la route est une chaîne

    try {
        const numericId = parseInt(id, 10); // Convertissez l'ID en nombre entier

        // Vérifiez si la conversion a réussi (si l'ID n'était pas un nombre valide)
        if (isNaN(numericId)) {
            return res.status(400).json({ message: 'Format d\'ID invalide. L\'ID doit être un nombre.' });
        }

        // Utilisez findOneAndDelete pour trouver un document où le champ 'id' (votre champ numérique personnalisé)
        // correspond à numericId et le supprimer.
        // Remplacez 'id' dans { id: numericId } par le nom exact de votre champ si ce n'est pas 'id'.
        const deletedFormateur = await Formateur.findOneAndDelete({ id: numericId });

        if (deletedFormateur) {
            // Le document a été trouvé et supprimé avec succès
            res.json({ message: 'Formateur supprimé avec succès', data: deletedFormateur });
        } else {
            // Aucun document trouvé avec cet ID numérique
            res.status(404).json({ message: 'Formateur non trouvé' });
        }
    } catch (error) {
        console.error('Erreur lors de la suppression du formateur:', error);
        res.status(500).json({ message: 'Une erreur est survenue lors de la suppression du formateur.' });
    }
}

export default Formateur;
