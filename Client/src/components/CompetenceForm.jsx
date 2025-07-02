import React, { useState } from 'react';
import { X, Plus, Trash2 } from 'lucide-react';

const CompetenceForm = ({ isOpen, onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    code: '',
    nom: '',
    sousCompetences: [{ nom: '', validee: false }]
  });

  const [errors, setErrors] = useState({});

  // Validation simple
  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) {
      newErrors.code = 'Le code est requis';
    } else if (!/^C[1-8]$/.test(formData.code)) {
      newErrors.code = 'Format: C1 à C8';
    }

    if (!formData.nom.trim()) {
      newErrors.nom = 'Le nom est requis';
    }

    if (formData.sousCompetences.length === 0) {
      newErrors.sousCompetences = 'Au moins une sous-compétence est requise';
    }

    formData.sousCompetences.forEach((sc, index) => {
      if (!sc.nom.trim()) {
        newErrors[`sousComp_${index}`] = 'Nom requis';
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onSubmit(formData);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      code: '',
      nom: '',
      sousCompetences: [{ nom: '', validee: false }]
    });
    setErrors({});
  };

  const addSousCompetence = () => {
    setFormData(prev => ({
      ...prev,
      sousCompetences: [...prev.sousCompetences, { nom: '', validee: false }]
    }));
  };

  const removeSousCompetence = (index) => {
    if (formData.sousCompetences.length > 1) {
      setFormData(prev => ({
        ...prev,
        sousCompetences: prev.sousCompetences.filter((_, i) => i !== index)
      }));
    }
  };

  const updateSousCompetence = (index, value) => {
    setFormData(prev => ({
      ...prev,
      sousCompetences: prev.sousCompetences.map((sc, i) => 
        i === index ? { ...sc, nom: value } : sc
      )
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Nouvelle Compétence</h2>
          <button
            onClick={() => {
              onClose();
              resetForm();
            }}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {/* Code */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Code de la compétence *
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
              placeholder="Ex: C1, C2, C3..."
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.code ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.code && <p className="text-red-500 text-sm mt-1">{errors.code}</p>}
          </div>

          {/* Nom */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Nom de la compétence *
            </label>
            <input
              type="text"
              value={formData.nom}
              onChange={(e) => setFormData(prev => ({ ...prev, nom: e.target.value }))}
              placeholder="Ex: Développement Frontend"
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.nom ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.nom && <p className="text-red-500 text-sm mt-1">{errors.nom}</p>}
          </div>

          {/* Sous-compétences */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <label className="block text-sm font-medium text-gray-700">
                Sous-compétences *
              </label>
              <button
                type="button"
                onClick={addSousCompetence}
                className="flex items-center text-blue-500 hover:text-blue-600 text-sm"
              >
                <Plus className="h-4 w-4 mr-1" />
                Ajouter
              </button>
            </div>

            <div className="space-y-3">
              {formData.sousCompetences.map((sousComp, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={sousComp.nom}
                    onChange={(e) => updateSousCompetence(index, e.target.value)}
                    placeholder={`Sous-compétence ${index + 1}`}
                    className={`flex-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      errors[`sousComp_${index}`] ? 'border-red-500' : 'border-gray-300'
                    }`}
                  />
                  {formData.sousCompetences.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeSousCompetence(index)}
                      className="text-red-500 hover:text-red-600 p-2"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.sousCompetences && (
              <p className="text-red-500 text-sm mt-1">{errors.sousCompetences}</p>
            )}
          </div>

          {/* Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => {
                onClose();
                resetForm();
              }}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Création...' : 'Créer la compétence'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CompetenceForm;