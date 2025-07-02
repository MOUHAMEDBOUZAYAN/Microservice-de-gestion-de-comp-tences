import React, { useState, useEffect } from 'react';
import { Plus, BarChart3, User, BookOpen, Check } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Import des composants
import LoadingSpinner from './components/LoadingSpinner';
import StatCard from './components/StatCard';
import CompetenceCard from './components/CompetenceCard';
import CompetenceForm from './components/CompetenceForm';

// Import du service API
import { competenceService } from './services/api';

const App = () => {
  const [competences, setCompetences] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [error, setError] = useState(null);

  // Calcul des statistiques
  const calculateStats = (competencesList) => {
    return competencesList.reduce((acc, comp) => {
      const validees = comp.sousCompetences?.filter(sc => sc.validee).length || 0;
      const total = comp.sousCompetences?.length || 0;
      const isValidee = validees >= (total - validees);
      
      return {
        totalCompetences: acc.totalCompetences + 1,
        competencesValidees: acc.competencesValidees + (isValidee ? 1 : 0),
        totalSousCompetences: acc.totalSousCompetences + total,
        sousCompetencesValidees: acc.sousCompetencesValidees + validees
      };
    }, {
      totalCompetences: 0,
      competencesValidees: 0,
      totalSousCompetences: 0,
      sousCompetencesValidees: 0
    });
  };

  // Calcul du statut d'une compétence
  const calculateEvaluation = (sousCompetences) => {
    const validees = sousCompetences.filter(sc => sc.validee).length;
    const nonValidees = sousCompetences.length - validees;
    
    return {
      validees,
      nonValidees,
      statut: validees >= nonValidees ? 'validée' : 'non validée',
      pourcentage: Math.round((validees / sousCompetences.length) * 100)
    };
  };

  // Chargement des compétences
  const loadCompetences = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await competenceService.getAll();
      
      // Ajouter l'évaluation à chaque compétence
      const competencesWithEvaluation = data.data?.map(comp => ({
        ...comp,
        evaluation: calculateEvaluation(comp.sousCompetences || [])
      })) || [];
      
      setCompetences(competencesWithEvaluation);
      setStats(calculateStats(competencesWithEvaluation));
    } catch (err) {
      setError('Impossible de charger les compétences. Vérifiez que votre API est démarrée.');
      setCompetences([]);
      setStats({
        totalCompetences: 0,
        competencesValidees: 0,
        totalSousCompetences: 0,
        sousCompetencesValidees: 0
      });
    } finally {
      setLoading(false);
    }
  };

  // Effet de chargement initial
  useEffect(() => {
    loadCompetences();
  }, []);

  // Créer une nouvelle compétence
  const handleCreateCompetence = async (formData) => {
    try {
      setFormLoading(true);
      await competenceService.create(formData);
      setShowForm(false);
      await loadCompetences(); // Recharger la liste
    } catch (err) {
      toast.error('Erreur lors de la création de la compétence');
    } finally {
      setFormLoading(false);
    }
  };

  // Toggle d'une sous-compétence
  const handleToggleSousCompetence = async (competenceId, sousCompIndex) => {
    try {
      const competence = competences.find(c => c._id === competenceId);
      const newSousCompetences = [...competence.sousCompetences];
      newSousCompetences[sousCompIndex].validee = !newSousCompetences[sousCompIndex].validee;

      // Mise à jour optimiste (UI d'abord)
      const updatedCompetences = competences.map(comp => {
        if (comp._id === competenceId) {
          return {
            ...comp,
            sousCompetences: newSousCompetences,
            evaluation: calculateEvaluation(newSousCompetences)
          };
        }
        return comp;
      });
      
      setCompetences(updatedCompetences);
      setStats(calculateStats(updatedCompetences));

      // Puis mise à jour sur le serveur
      await competenceService.updateEvaluation(competenceId, newSousCompetences);
    } catch (err) {
      // En cas d'erreur, recharger les données
      loadCompetences();
      toast.error('Erreur lors de la mise à jour');
    }
  };

  // Supprimer une compétence
  const handleDeleteCompetence = async (competenceId) => {
    try {
      await competenceService.delete(competenceId);
      await loadCompetences(); // Recharger la liste
    } catch (err) {
      toast.error('Erreur lors de la suppression');
    }
  };

  // Ajouter une sous-compétence à une compétence existante
  const handleAddSousCompetence = async (competenceId, sousCompNom) => {
    try {
      const competence = competences.find(c => c._id === competenceId);
      const newSousCompetences = [
        ...competence.sousCompetences,
        { nom: sousCompNom, validee: false }
      ];
      // Mise à jour optimiste
      const updatedCompetences = competences.map(comp => {
        if (comp._id === competenceId) {
          return {
            ...comp,
            sousCompetences: newSousCompetences,
            evaluation: calculateEvaluation(newSousCompetences)
          };
        }
        return comp;
      });
      setCompetences(updatedCompetences);
      setStats(calculateStats(updatedCompetences));
      // Mise à jour sur le serveur
      await competenceService.updateEvaluation(competenceId, newSousCompetences);
      toast.success('Sous-compétence ajoutée !');
    } catch (err) {
      loadCompetences();
      toast.error('Erreur lors de l\'ajout de la sous-compétence');
    }
  };

  if (loading) {
    return <LoadingSpinner message="Chargement des compétences..." />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <BookOpen className="h-8 w-8 text-blue-500" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Gestion des Compétences</h1>
                <p className="text-sm text-gray-600">404.js - Suivi des formations</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary flex items-center space-x-2"
            >
              <Plus className="h-4 w-4" />
              <span>Nouvelle compétence</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            <p>{error}</p>
            <button 
              onClick={loadCompetences}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {/* Statistiques */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <StatCard
              icon={<BarChart3 className="h-6 w-6" />}
              title="Compétences totales"
              value={stats.totalCompetences}
              color="blue"
            />
            <StatCard
              icon={<Check className="h-6 w-6" />}
              title="Compétences validées"
              value={stats.competencesValidees}
              color="green"
            />
            <StatCard
              icon={<User className="h-6 w-6" />}
              title="Sous-compétences"
              value={stats.totalSousCompetences}
              color="purple"
            />
            <StatCard
              icon={<BookOpen className="h-6 w-6" />}
              title="Validées"
              value={stats.sousCompetencesValidees}
              color="orange"
            />
          </div>
        )}

        {/* Liste des compétences */}
        <div className="space-y-6">
          {competences.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <p>Aucune compétence trouvée.</p>
            </div>
          ) : (
            competences.map((competence) => (
              <CompetenceCard
                key={competence._id}
                competence={competence}
                onToggleSousCompetence={handleToggleSousCompetence}
                onDelete={handleDeleteCompetence}
                onAddSousCompetence={handleAddSousCompetence}
              />
            ))
          )}
        </div>
      </div>

      {/* Modal du formulaire de création */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
              onClick={() => setShowForm(false)}
              disabled={formLoading}
            >
              <span className="text-xl">&times;</span>
            </button>
            <h2 className="text-xl font-bold mb-4">Nouvelle compétence</h2>
            <CompetenceForm
              isOpen={true}
              onClose={() => setShowForm(false)}
              onSubmit={handleCreateCompetence}
              loading={formLoading}
            />
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default App;