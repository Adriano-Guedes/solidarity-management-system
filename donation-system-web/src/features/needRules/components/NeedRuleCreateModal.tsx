import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { FiX, FiPlus } from 'react-icons/fi';
import type { CreateNeedRuleRequest } from '../../../types/needRule';
import type { AgeRangeResponse } from '../../../types/ageRange';
import type { NeedGroupResponse } from '../../../types/needGroup';

interface NeedRuleCreateModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: CreateNeedRuleRequest) => void;
  loading?: boolean;
  ageRanges: AgeRangeResponse[];
  needGroups: NeedGroupResponse[];
}

const NeedRuleCreateModal: React.FC<NeedRuleCreateModalProps> = ({ show, onClose, onSave, loading = false, ageRanges, needGroups }) => {
  const [form, setForm] = useState<CreateNeedRuleRequest>({
    ageRangeId: '',
    needGroupId: '',
    value: 0
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (show) {
      setForm({ ageRangeId: '', needGroupId: '', value: 0 });
      setErrors({});
    }
  }, [show]);

  const validate = (formData: CreateNeedRuleRequest) => {
    const newErrors: Record<string, string> = {};
    if (!formData.ageRangeId) newErrors.ageRangeId = 'A faixa etária é obrigatória.';
    if (!formData.needGroupId) newErrors.needGroupId = 'O grupo de necessidade é obrigatório.';
    if (formData.value < 0) newErrors.value = 'O valor deve ser maior ou igual a zero.';
    return newErrors;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: name === 'value' ? Number(value) : value
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
          <Modal.Title className="fw-bold">Nova Regra de Necessidade</Modal.Title>
        </Modal.Header>
        <Modal.Body className="pt-2">
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Faixa Etária *</Form.Label>
                  <Form.Select name="ageRangeId" value={form.ageRangeId} onChange={handleChange} isInvalid={!!currentErrors.ageRangeId} style={inputStyle}>
                    <option value="">Selecione...</option>
                    {ageRanges.map(ar => <option key={ar.id} value={ar.id}>{ar.name} ({ar.minAge}-{ar.maxAge} anos)</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{currentErrors.ageRangeId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Grupo de Necessidade *</Form.Label>
                  <Form.Select name="needGroupId" value={form.needGroupId} onChange={handleChange} isInvalid={!!currentErrors.needGroupId} style={inputStyle}>
                    <option value="">Selecione...</option>
                    {needGroups.map(ng => <option key={ng.id} value={ng.id}>{ng.name}</option>)}
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{currentErrors.needGroupId}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Valor da Necessidade *</Form.Label>
                  <Form.Control type="number" step="0.1" name="value" value={form.value} onChange={handleChange} isInvalid={!!currentErrors.value} style={inputStyle} />
                  <Form.Control.Feedback type="invalid">{currentErrors.value}</Form.Control.Feedback>
                </Form.Group>
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

export default NeedRuleCreateModal;
