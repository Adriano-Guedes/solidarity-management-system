import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { FiX, FiPlus } from 'react-icons/fi';
import type { CreateNeedGroupRequest } from '../../../types/needGroup';

interface NeedGroupCreateModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: CreateNeedGroupRequest) => void;
  loading?: boolean;
}

const NeedGroupCreateModal: React.FC<NeedGroupCreateModalProps> = ({ show, onClose, onSave, loading = false }) => {
  const [form, setForm] = useState<CreateNeedGroupRequest>({
    name: '',
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (show) {
      setForm({ name: '', active: true });
      setErrors({});
    }
  }, [show]);

  const validate = (formData: CreateNeedGroupRequest) => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'O nome é obrigatório.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
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
          <Modal.Title className="fw-bold">Novo Grupo de Necessidade</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Nome do Grupo *</Form.Label>
                  <Form.Control name="name" value={form.name} onChange={handleChange} isInvalid={!!currentErrors.name} style={inputStyle} placeholder="Ex: Higiene" />
                  <Form.Control.Feedback type="invalid">{currentErrors.name}</Form.Control.Feedback>
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
          <button className="btn-primary-custom" onClick={() => onSave(form)} disabled={loading || !isFormValid}>
            {loading ? 'Cadastrando...' : <><FiPlus className="me-1" /> Cadastrar</>}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default NeedGroupCreateModal;
