import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { FiSave } from 'react-icons/fi';
import type { AgeRangeResponse, UpdateAgeRangeRequest } from '../../../types/ageRange';

interface AgeRangeEditModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (id: string, data: UpdateAgeRangeRequest) => void;
  loading?: boolean;
  initialData: AgeRangeResponse | null;
}

const AgeRangeEditModal: React.FC<AgeRangeEditModalProps> = ({ show, onClose, onSave, loading = false, initialData }) => {
  const [form, setForm] = useState<UpdateAgeRangeRequest>({
    name: '',
    minAge: 0,
    maxAge: 0,
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData && show) {
      setForm({
        name: initialData.name,
        minAge: initialData.minAge,
        maxAge: initialData.maxAge,
        active: initialData.active
      });
    }
  }, [initialData, show]);

  const validate = (formData: UpdateAgeRangeRequest) => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
    if (formData.minAge < 0) newErrors.minAge = 'Idade mínima inválida.';
    if (formData.maxAge < formData.minAge) newErrors.maxAge = 'Idade máxima deve ser maior ou igual à mínima.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
    }));
  };

  const currentErrors = validate(form);
  const isFormValid = Object.keys(currentErrors).length === 0;

  const labelStyle: React.CSSProperties = { fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px', display: 'block' };
  const inputStyle: React.CSSProperties = { borderRadius: '10px', border: '1px solid var(--border)', padding: '10px 14px', fontSize: '14px' };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static">
      <div className="p-3">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-bold">Editar Faixa Etária</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Nome da Faixa Etária *</Form.Label>
                  <Form.Control name="name" value={form.name} onChange={handleChange} isInvalid={!!currentErrors.name} style={inputStyle} />
                  <Form.Control.Feedback type="invalid">{currentErrors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Idade Mínima *</Form.Label>
                  <Form.Control type="number" name="minAge" value={form.minAge} onChange={handleChange} isInvalid={!!currentErrors.minAge} style={inputStyle} />
                  <Form.Control.Feedback type="invalid">{currentErrors.minAge}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Idade Máxima *</Form.Label>
                  <Form.Control type="number" name="maxAge" value={form.maxAge} onChange={handleChange} isInvalid={!!currentErrors.maxAge} style={inputStyle} />
                  <Form.Control.Feedback type="invalid">{currentErrors.maxAge}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Check type="switch" label="Ativo" name="active" checked={form.active} onChange={handleChange} />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <button className="btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn-primary-custom" onClick={() => initialData && onSave(initialData.id, form)} disabled={loading || !isFormValid}>
            {loading ? 'Salvando...' : <><FiSave className="me-1" /> Salvar</>}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default AgeRangeEditModal;
