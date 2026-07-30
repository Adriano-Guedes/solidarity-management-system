import React, { useEffect, useState } from 'react';
import { Modal, Form, Row, Col } from 'react-bootstrap';
import { FiX, FiSave, FiCalendar, FiHash } from 'react-icons/fi';
import type { InventoryBatchResponse, UpdateInventoryBatchRequest } from '../../../types/inventoryBatch';

interface InventoryBatchEditModalProps {
  show: boolean;
  onClose: () => void;
  onSave: (data: UpdateInventoryBatchRequest) => void;
  loading?: boolean;
  batch: InventoryBatchResponse | null;
}

const InventoryBatchEditModal: React.FC<InventoryBatchEditModalProps> = ({ show, onClose, onSave, loading = false, batch }) => {
  const [form, setForm] = useState<UpdateInventoryBatchRequest>({
    itemId: '',
    quantityAvailable: 0,
    expirationDate: ''
  });

  useEffect(() => {
    if (batch && show) {
      setForm({
        itemId: batch.itemId,
        quantityAvailable: batch.quantityAvailable,
        expirationDate: batch.expirationDate ? batch.expirationDate.split('T')[0] : ''
      });
    }
  }, [batch, show]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'quantityAvailable' ? Number(value) : value,
    }));
  };

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
      style={{ zIndex: 20001 }}
    >
      <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff' }}>
        <Modal.Header style={{ borderBottom: '1px solid var(--border)', padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fff' }}>
          <div>
            <Modal.Title style={{ fontSize: '18px', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>Editar Lote em Estoque</Modal.Title>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Ajuste a quantidade e a validade deste lote</div>
          </div>
          <button className="btn-icon-sm" onClick={onClose} style={{ fontSize: '20px' }}>
            <FiX />
          </button>
        </Modal.Header>
        
        <Modal.Body style={{ padding: '24px', background: '#fff' }}>
          <Form autoComplete="off">
            <Row className="g-4">
              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>
                    <FiHash style={{ marginRight: '6px' }} /> Quantidade Disponível
                  </Form.Label>
                  <Form.Control
                    name="quantityAvailable"
                    type="number"
                    value={form.quantityAvailable}
                    onChange={handleChange}
                    style={inputStyle}
                    placeholder="Ex: 50"
                    autoFocus
                  />
                  <Form.Text className="text-muted" style={{ fontSize: '11px' }}>
                    Esta quantidade será refletida no estoque total do item.
                  </Form.Text>
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label style={labelStyle}>
                    <FiCalendar style={{ marginRight: '6px' }} /> Data de Validade
                  </Form.Label>
                  <Form.Control
                    name="expirationDate"
                    type="date"
                    value={form.expirationDate || ''}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                  <Form.Text className="text-muted" style={{ fontSize: '11px' }}>
                    Deixe em branco se o item não possuir data de validade.
                  </Form.Text>
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
            disabled={loading}
            style={{ padding: '10px 24px', flex: 1, justifyContent: 'center', borderRadius: '10px' }}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Salvando...
              </>
            ) : (
              <><FiSave /> Atualizar Lote</>
            )}
          </button>
        </Modal.Footer>
      </div>
    </Modal>
  );
};

export default InventoryBatchEditModal;
