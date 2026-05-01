import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { FiX, FiPlus } from 'react-icons/fi';
import type { CreateFamilyMemberRequest } from '../../../types/familyMember';

interface FamilyMemberCreateModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: CreateFamilyMemberRequest) => void;
  loading?: boolean;
  familyId: string;
}

const FamilyMemberCreateModal: React.FC<FamilyMemberCreateModalProps> = ({ show, onClose, onSave, loading = false, familyId }) => {
  const [form, setForm] = useState<CreateFamilyMemberRequest>({
    familyId: familyId,
    name: '',
    documentNumber: '',
    birthDate: '',
    gender: '',
    relationship: '',
    hasDisability: false,
    hasChronicDisease: false,
    isResponsible: false
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (show) {
      setForm({
        familyId: familyId,
        name: '',
        documentNumber: '',
        birthDate: '',
        gender: '',
        relationship: '',
        hasDisability: false,
        hasChronicDisease: false,
        isResponsible: false
      });
      setTouched({});
    }
  }, [show, familyId]);

  const validate = (formData: CreateFamilyMemberRequest) => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = 'O nome é obrigatório.';
    } else if (formData.name.length < 2 || formData.name.length > 150) {
      newErrors.name = 'O nome deve ter entre 2 e 150 caracteres.';
    }

    if (!formData.birthDate) {
      newErrors.birthDate = 'A data de nascimento é obrigatória.';
    }

    return newErrors;
  };

  useEffect(() => {
    setErrors(validate(form));
  }, [form]);

  const currentErrors = validate(form);
  const isFormValid = Object.keys(currentErrors).length === 0;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleBlur = (e: React.FocusEvent<any>) => {
    setTouched(prev => ({ ...prev, [e.target.name]: true }));
  };

  const inputStyle: React.CSSProperties = {
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--body-bg)',
    padding: '10px 14px',
    fontSize: '14px',
    color: 'var(--text-main)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: '6px',
    display: 'block',
  };

  return (
    <Modal show={show} onHide={onClose} centered backdrop="static" size="lg">
      <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
        <Modal.Header style={{ borderBottom: '1px solid var(--border)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Modal.Title style={{ fontSize: '18px', fontWeight: 700 }}>Novo Membro da Família</Modal.Title>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Adicione um novo integrante a esta família</div>
          </div>
          <button className="btn-icon-sm" onClick={onClose}><FiX /></button>
        </Modal.Header>
        <Modal.Body style={{ padding: '24px' }}>
          <Form>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Nome Completo <span className="text-danger">*</span></Form.Label>
                  <Form.Control name="name" value={form.name} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.name && !!errors.name} style={inputStyle} placeholder="Ex: João da Silva" />
                  <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Documento</Form.Label>
                  <Form.Control name="documentNumber" value={form.documentNumber} onChange={handleChange} style={inputStyle} placeholder="CPF ou RG" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Data de Nascimento <span className="text-danger">*</span></Form.Label>
                  <Form.Control type="date" name="birthDate" value={form.birthDate} onChange={handleChange} onBlur={handleBlur} isInvalid={touched.birthDate && !!errors.birthDate} style={inputStyle} />
                  <Form.Control.Feedback type="invalid">{errors.birthDate}</Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Gênero</Form.Label>
                  <Form.Select name="gender" value={form.gender} onChange={handleChange} style={{ ...inputStyle, appearance: 'auto' }}>
                    <option value="">Selecione...</option>
                    <option value="Masculino">Masculino</option>
                    <option value="Feminino">Feminino</option>
                    <option value="Outro">Outro</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Estado Civil</Form.Label>
                  <Form.Select name="relationship" value={form.relationship} onChange={handleChange} style={{ ...inputStyle, appearance: 'auto' }}>
                    <option value="">Selecione...</option>
                    <option value="Solteiro(a)">Solteiro(a)</option>
                    <option value="Casado(a)">Casado(a)</option>
                    <option value="União Estável">União Estável</option>
                    <option value="Divorciado(a)">Divorciado(a)</option>
                    <option value="Viúvo(a)">Viúvo(a)</option>
                    <option value="Separado(a)">Separado(a)</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Check type="switch" label="PCD" name="hasDisability" checked={form.hasDisability} onChange={handleChange} style={{ fontWeight: 500, fontSize: '14px' }} />
              </Col>
              <Col md={4}>
                <Form.Check type="switch" label="Doença Crônica" name="hasChronicDisease" checked={form.hasChronicDisease} onChange={handleChange} style={{ fontWeight: 500, fontSize: '14px' }} />
              </Col>
              <Col md={4}>
                <Form.Check type="switch" label="Responsável" name="isResponsible" checked={form.isResponsible} onChange={handleChange} style={{ fontWeight: 500, fontSize: '14px' }} />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ borderTop: '1px solid var(--border)', padding: '16px 24px', background: '#f8fafc', display: 'flex', gap: '12px' }}>
          <button 
            type="button"
            className="btn-ghost" 
            onClick={onClose} 
            disabled={loading}
            style={{ padding: '10px 20px', borderRadius: '10px' }}
          >
            Cancelar
          </button>
          <button 
            type="button"
            className="btn-primary-custom" 
            onClick={() => onSave(form)} 
            disabled={loading || !isFormValid}
            style={{ 
              padding: '10px 24px', 
              minWidth: '180px', 
              justifyContent: 'center', 
              borderRadius: '10px',
              opacity: (loading || !isFormValid) ? 0.6 : 1,
              cursor: (loading || !isFormValid) ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Salvando...
              </>
            ) : (
              <><FiPlus /> Adicionar Membro</>
            )}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default FamilyMemberCreateModal;
