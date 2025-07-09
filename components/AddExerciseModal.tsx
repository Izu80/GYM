
import React, { useState } from 'react';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Button from './ui/Button';

interface AddExerciseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddExercise: (name: string, sets: number) => void;
}

const AddExerciseModal: React.FC<AddExerciseModalProps> = ({ isOpen, onClose, onAddExercise }) => {
  const [name, setName] = useState('');
  const [sets, setSets] = useState(4);
  const [error, setError] = useState('');

  const handleSubmit = () => {
    if (!name.trim()) {
      setError('El nombre del ejercicio no puede estar vacío.');
      return;
    }
    if (sets <= 0) {
      setError('El número de series debe ser mayor que cero.');
      return;
    }
    onAddExercise(name, sets);
    setName('');
    setSets(4);
    setError('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Añadir Nuevo Ejercicio">
      <div className="space-y-4">
        <Input
          label="Nombre del Ejercicio"
          id="exercise-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Ej: Press de Banca"
          autoFocus
        />
        <Input
          label="Número de Series"
          id="exercise-sets"
          type="number"
          value={sets}
          onChange={(e) => setSets(parseInt(e.target.value, 10))}
          min="1"
        />
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSubmit}>
            Añadir Ejercicio
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default AddExerciseModal;
