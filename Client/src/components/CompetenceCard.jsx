import React, { useState } from 'react';
import { Check, X, Trash2, MoreVertical, Plus } from 'lucide-react';

const CompetenceCard = ({ competence, onToggleSousCompetence, onDelete, onAddSousCompetence }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [newSousComp, setNewSousComp] = useState('');
  const [adding, setAdding] = useState(false);
  const { _id, code, nom, sousCompetences, evaluation } = competence;
  const isValidee = evaluation?.statut === 'validée';

  const handleDelete = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette compétence ?')) {
      onDelete(_id);
    }
    setShowMenu(false);
  };

  const handleAddSousCompetence = async () => {
    if (!newSousComp.trim()) return;
    setAdding(true);
    await onAddSousCompetence(_id, newSousComp.trim());
    setNewSousComp('');
    setAdding(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
      {/* En-tête */}
      <div className="p-6 border-b bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              isValidee ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {code}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{nom}</h3>
              <p className="text-sm text-gray-600">
                {evaluation?.validees || 0}/{sousCompetences?.length || 0} sous-compétences validées
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="text-right">
              <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isValidee ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}>
                {isValidee ? <Check className="h-4 w-4 mr-1" /> : <X className="h-4 w-4 mr-1" />}
                {evaluation?.statut || 'non validée'}
              </div>
              <p className="text-sm text-gray-500 mt-1">{evaluation?.pourcentage || 0}%</p>
            </div>
            
            {/* Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <MoreVertical className="h-4 w-4" />
              </button>
              
              {showMenu && (
                <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border z-10">
                  <button
                    onClick={handleDelete}
                    className="w-full px-4 py-2 text-left text-red-600 hover:bg-red-50 flex items-center space-x-2"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Supprimer</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Barre de progression */}
        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full transition-all duration-300 ${
                isValidee ? 'bg-green-500' : 'bg-red-500'
              }`}
              style={{ width: `${evaluation?.pourcentage || 0}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Sous-compétences */}
      <div className="p-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Sous-compétences :</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {sousCompetences?.map((sousComp, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                sousComp.validee 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
              }`}
              onClick={() => onToggleSousCompetence(_id, index)}
            >
              <span className={`font-medium ${
                sousComp.validee ? 'text-green-800' : 'text-gray-700'
              }`}>
                {sousComp.nom}
              </span>
              <div className={`p-1 rounded-full ${
                sousComp.validee ? 'bg-green-500' : 'bg-gray-300'
              }`}>
                {sousComp.validee ? (
                  <Check className="h-3 w-3 text-white" />
                ) : (
                  <X className="h-3 w-3 text-gray-600" />
                )}
              </div>
            </div>
          ))}
        </div>
        {/* Ajout de sous-compétence */}
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="text"
            value={newSousComp}
            onChange={e => setNewSousComp(e.target.value)}
            placeholder="Ajouter une sous-compétence..."
            className="flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            disabled={adding}
          />
          <button
            type="button"
            onClick={handleAddSousCompetence}
            className="btn-primary flex items-center px-3 py-2"
            disabled={adding || !newSousComp.trim()}
          >
            <Plus className="h-4 w-4 mr-1" /> Ajouter
          </button>
        </div>
      </div>
      
      {/* Overlay pour fermer le menu */}
      {showMenu && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowMenu(false)}
        ></div>
      )}
    </div>
  );
};

export default CompetenceCard;