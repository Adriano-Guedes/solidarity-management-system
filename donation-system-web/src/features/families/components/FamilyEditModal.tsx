import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { FiX, FiCheck } from 'react-icons/fi';
import type { FamilyResponse, UpdateFamilyRequest } from '../../../types/family';

interface FamilyEditModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: UpdateFamilyRequest) => void;
  loading?: boolean;
  initialData: FamilyResponse | null;
}

const FamilyEditModal: React.FC<FamilyEditModalProps> = ({ show, onClose, onSave, loading = false, initialData }) => {
  const [form, setForm] = useState<UpdateFamilyRequest>({
    responsibleName: '',
    responsibleDocument: '',
    phoneNumber: '',
    address: '',
    monthlyIncome: 0,
    notes: '',
    active: true
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const validate = (formData: UpdateFamilyRequest) => {
    const newErrors: Record<string, string> = {};

    if (!formData.responsibleName.trim()) {
      newErrors.responsibleName = 'O nome do responsável é obrigatório.';
    } else if (formData.responsibleName.length < 2 || formData.responsibleName.length > 150) {
      newErrors.responsibleName = 'O nome deve ter entre 2 e 150 caracteres.';
    }

    if (formData.responsibleDocument && formData.responsibleDocument.length > 20) {
      newErrors.responsibleDocument = 'O documento deve ter no máximo 20 caracteres.';
    }

    if (formData.phoneNumber && formData.phoneNumber.length > 20) {
      newErrors.phoneNumber = 'O telefone deve ter no máximo 20 caracteres.';
    }

    if (formData.address && formData.address.length > 255) {
      newErrors.address = 'O endereço deve ter no máximo 255 caracteres.';
    }

    if (formData.monthlyIncome !== undefined && formData.monthlyIncome < 0) {
      newErrors.monthlyIncome = 'A renda mensal não pode ser negativa.';
    }

    if (formData.notes && formData.notes.length > 1000) {
      newErrors.notes = 'As observações devem ter no máximo 1000 caracteres.';
    }

    return newErrors;
  };

  useEffect(() => {
    if (show && initialData) {
      setForm({
        responsibleName: initialData.responsibleName || '',
        responsibleDocument: initialData.responsibleDocument || '',
        phoneNumber: initialData.phoneNumber || '',
        address: initialData.address || '',
        monthlyIncome: initialData.monthlyIncome || 0,
        notes: initialData.notes || '',
        active: initialData.active
      });
      setErrors({});
      setTouched({});
    }
  }, [show, initialData]);

  useEffect(() => {
    setErrors(validate(form));
  }, [form]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'monthlyIncome' ? (value === '' ? 0 : Number(value)) : value,
    }));
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
  };

  const isFormValid = Object.keys(errors).length === 0;

  const inputStyle: React.CSSProperties = {
    borderRadius: '10px',
    border: '1px solid var(--border)',
    background: 'var(--body-bg)',
    padding: '10px 14px',
    fontSize: '14px',
    color: 'var(--text-main)',
    transition: 'border-color var(--transition)',
  };

  const labelStyle: React.CSSProperties = {
    fontSize: '13px',
    fontWeight: 600,
    color: 'var(--text-muted)',
    marginBottom: '6px',
    display: 'block',
  };

  return (
    <Modal 
      show={show} 
      onHide={onClose} 
      centered 
      backdrop="static" 
      size="lg"
      contentClassName="border-0 shadow-lg"
      style={{ zIndex: 20000 }}
    >
      <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
        <Modal.Header style={{ borderBottom: '1px solid var(--border)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <div>
            <Modal.Title style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>Editar Dados da Família</Modal.Title>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Atualize as informações do responsável e da família</div>
          </div>
          <button className="btn-icon-sm" onClick={onClose} style={{ fontSize: '20px' }}>
            <FiX />
          </button>
        </Modal.Header>
        
        <Modal.Body style={{ padding: '24px', background: '#fff' }}>
          <Form autoComplete="off">
            <Row className="g-3">
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>
                    Nome do Responsável <span style={{ color: 'var(--danger)' }}>*</span>
                  </Form.Label>
                  <Form.Control
                    name="responsibleName"
                    value={form.responsibleName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.responsibleName && !!errors.responsibleName}
                    style={inputStyle}
                    placeholder="Ex: Maria da Silva"
                    autoFocus
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.responsibleName}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Documento (CPF/RG)</Form.Label>
                  <Form.Control
                    name="responsibleDocument"
                    value={form.responsibleDocument}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.responsibleDocument && !!errors.responsibleDocument}
                    style={inputStyle}
                    placeholder="000.000.000-00"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.responsibleDocument}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Telefone de Contato</Form.Label>
                  <Form.Control
                    name="phoneNumber"
                    value={form.phoneNumber}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.phoneNumber && !!errors.phoneNumber}
                    style={inputStyle}
                    placeholder="(00) 00000-0000"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.phoneNumber}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={8}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Endereço Residencial</Form.Label>
                  <Form.Control
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.address && !!errors.address}
                    style={inputStyle}
                    placeholder="Rua, Número, Bairro"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.address}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Renda Mensal Familiar</Form.Label>
                  <Form.Control
                    name="monthlyIncome"
                    type="number"
                    step="0.01"
                    value={form.monthlyIncome ?? ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.monthlyIncome && !!errors.monthlyIncome}
                    style={inputStyle}
                    placeholder="0.00"
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.monthlyIncome}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>Observações / Notas</Form.Label>
                  <Form.Control
                    as="textarea"
                    name="notes"
                    value={form.notes}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isInvalid={touched.notes && !!errors.notes}
                    style={{ ...inputStyle, minHeight: '80px', resize: 'vertical' }}
                    placeholder="Informações adicionais relevantes sobre a família..."
                  />
                  <Form.Control.Feedback type="invalid">
                    {errors.notes}
                  </Form.Control.Feedback>
                </Form.Group>
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
              minWidth: '160px', 
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
              <><FiCheck /> Salvar Alterações</>
            )}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default FamilyEditModal;
