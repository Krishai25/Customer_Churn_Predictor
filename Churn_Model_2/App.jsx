import { useState, useEffect } from 'react';
import axios from 'axios';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import './App.css';

function App() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [lastUpdated, setLastUpdated] = useState('Never');
  const [recommendation, setRecommendation] = useState(null);
  
  const [formData, setFormData] = useState({
    gender: 'Male',
    SeniorCitizen: 0,
    Partner: 'No',
    Dependents: 'No',
    tenure: 12,
    PhoneService: 'Yes',
    MultipleLines: 'No',
    InternetService: 'Fiber optic',
    OnlineSecurity: 'No',
    OnlineBackup: 'Yes',
    DeviceProtection: 'No',
    TechSupport: 'No',
    StreamingTV: 'Yes',
    StreamingMovies: 'No',
    Contract: 'Month-to-month',
    PaperlessBilling: 'Yes',
    PaymentMethod: 'Electronic check',
    MonthlyCharges: 85.0,
    TotalCharges: 1000.0
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const parsedValue = (name === 'tenure' || name === 'MonthlyCharges' || name === 'TotalCharges' || name === 'SeniorCitizen') 
      ? Number(value) 
      : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: parsedValue
    }));
  };

  const handleSubmit = async (e) => {
    if(e) e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://127.0.0.1:5000/predict', formData);
      setResult(response.data);
      setRecommendation(response.data.recommendation || null);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (error) {
      console.error("Prediction error:", error);
      alert("API Error: Please ensure the Flask backend is running on port 5000.");
    } finally {
      setLoading(false);
    }
  };

  const getColor = (prob) => {
    if (prob > 0.6) return 'var(--gf-red)';
    if (prob > 0.4) return 'var(--gf-orange)';
    return 'var(--gf-green)';
  };

  const renderGaugePanel = (probability, title, accuracy, prediction, id) => {
    if (!result) return (
      <div className="gf-panel h-100">
        <div className="gf-panel-header">{title} <span className="gf-panel-header-desc">No Data</span></div>
        <div className="gf-panel-content gf-stat-panel">
          <span style={{color: 'var(--gf-text-muted)'}}>Execute query to load metrics</span>
        </div>
      </div>
    );

    const churnProb = probability * 100;
    const stayProb = 100 - churnProb;
    const color = getColor(probability);

    const data = [
      { name: 'Churn', value: churnProb },
      { name: 'Stay', value: stayProb }
    ];

    const COLORS = [color, 'var(--gf-input-bg)'];

    return (
      <div className="gf-panel h-100">
        <div className="gf-panel-header">
          {title} 
          <span className="gf-panel-header-desc">Acc: {accuracy}%</span>
        </div>
        <div className="gf-panel-content gf-stat-panel">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                startAngle={225}
                endAngle={-45}
                dataKey="value"
                stroke="var(--gf-border-color)"
                strokeWidth={1}
                cornerRadius={2}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          
          <div className="donut-center-overlay">
            <span className="donut-center-value" style={{color: color}}>
              {churnProb.toFixed(1)}%
            </span>
            <span className="donut-center-text" style={{color: color}}>
              {prediction === 1 ? 'CHURN RISK' : 'SECURE'}
            </span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Top Navbar */}
      <div className="gf-navbar">
        <div className="gf-navbar-brand">
          <span className="logo">☷</span>
          Grafana / Churn Observatory
        </div>
      </div>

      <div className="gf-dashboard">
        
        {/* Header Options */}
        <div className="gf-dashboard-header">
          <h1 className="gf-dashboard-title">Customer Retention Telemetry</h1>
          <div className="gf-time-picker">
            ⏱ Last updated: {lastUpdated}
          </div>
        </div>

        <div className="gf-grid">
          
          {/* LEFT: DATA ENTRY PANEL */}
          <div className="gf-col-8">
            <div className="gf-panel h-100">
              <div className="gf-panel-header">
                Data Vector Configuration
                <span className="gf-panel-header-desc">Input Parameters</span>
              </div>
              <div className="gf-panel-content">
                <form onSubmit={handleSubmit}>
                  
                  <div className="gf-form-group">
                    <div className="gf-form-group-title">Demographics</div>
                    <div className="gf-form-inline">
                      <div className="gf-form-field">
                        <label className="gf-form-label">Gender</label>
                        <select name="gender" className="gf-select" value={formData.gender} onChange={handleChange}>
                          <option>Male</option><option>Female</option>
                        </select>
                      </div>
                      <div className="gf-form-field">
                        <label className="gf-form-label">Senior Citizen</label>
                        <select name="SeniorCitizen" className="gf-select" value={formData.SeniorCitizen} onChange={handleChange}>
                          <option value={0}>No (0)</option><option value={1}>Yes (1)</option>
                        </select>
                      </div>
                      <div className="gf-form-field">
                        <label className="gf-form-label">Partner</label>
                        <select name="Partner" className="gf-select" value={formData.Partner} onChange={handleChange}>
                          <option>Yes</option><option>No</option>
                        </select>
                      </div>
                      <div className="gf-form-field">
                        <label className="gf-form-label">Dependents</label>
                        <select name="Dependents" className="gf-select" value={formData.Dependents} onChange={handleChange}>
                          <option>Yes</option><option>No</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="gf-form-group">
                    <div className="gf-form-group-title">Account Parameters</div>
                    <div className="gf-form-inline">
                      <div className="gf-form-field">
                        <label className="gf-form-label">Tenure (Months)</label>
                        <input type="number" name="tenure" className="gf-input" value={formData.tenure} onChange={handleChange} />
                      </div>
                      <div className="gf-form-field">
                        <label className="gf-form-label">Contract Type</label>
                        <select name="Contract" className="gf-select" value={formData.Contract} onChange={handleChange}>
                          <option>Month-to-month</option><option>One year</option><option>Two year</option>
                        </select>
                      </div>
                      <div className="gf-form-field">
                        <label className="gf-form-label">Monthly Charges</label>
                        <input type="number" step="0.1" name="MonthlyCharges" className="gf-input" value={formData.MonthlyCharges} onChange={handleChange} />
                      </div>
                      <div className="gf-form-field">
                        <label className="gf-form-label">Total Charges</label>
                        <input type="number" step="0.1" name="TotalCharges" className="gf-input" value={formData.TotalCharges} onChange={handleChange} />
                      </div>
                    </div>
                  </div>

                  <div className="gf-form-group">
                    <div className="gf-form-group-title">Service Entitlements</div>
                    <div className="gf-form-inline">
                      <div className="gf-form-field">
                        <label className="gf-form-label">Internet Service</label>
                        <select name="InternetService" className="gf-select" value={formData.InternetService} onChange={handleChange}>
                          <option>DSL</option><option>Fiber optic</option><option>No</option>
                        </select>
                      </div>
                      <div className="gf-form-field">
                        <label className="gf-form-label">Payment Method</label>
                        <select name="PaymentMethod" className="gf-select" value={formData.PaymentMethod} onChange={handleChange}>
                          <option>Electronic check</option><option>Mailed check</option>
                          <option>Bank transfer (automatic)</option><option>Credit card (automatic)</option>
                        </select>
                      </div>
                      <div className="gf-form-field">
                        <label className="gf-form-label">Phone Service</label>
                        <select name="PhoneService" className="gf-select" value={formData.PhoneService} onChange={handleChange}>
                          <option>Yes</option><option>No</option>
                        </select>
                      </div>
                      <div className="gf-form-field">
                        <label className="gf-form-label">Tech Support</label>
                        <select name="TechSupport" className="gf-select" value={formData.TechSupport} onChange={handleChange}>
                          <option>Yes</option><option>No</option><option>No internet service</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  <div style={{display: 'flex', gap: '12px', marginTop: '32px'}}>
                    <button type="submit" className="gf-btn" disabled={loading}>
                      {loading ? "► QUERYING AI MODELS..." : "► EXECUTE QUERY"}
                    </button>
                    <button type="button" className="gf-btn gf-btn-outline" onClick={() => setFormData({...formData, tenure: 0, MonthlyCharges: 0, TotalCharges: 0})}>
                      ⟳ RESET
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>

          {/* RIGHT: OUTPUT PANELS */}
          <div className="gf-col-4" style={{display: 'flex', flexDirection: 'column', gap: '16px'}}>
            
            {renderGaugePanel(result?.rf_probability, "Random Forest Estimator", "78.71", result?.rf_prediction, 1)}
            
            {renderGaugePanel(result?.svm_probability, "Support Vector Machine", "82.04", result?.svm_prediction, 2)}
            
            <div className="gf-panel">
              <div className="gf-panel-header">
                AI Retention Advisor
                <span className="gf-panel-header-desc">Powered by LLaMA 3</span>
              </div>
              <div className="gf-panel-content">
                {recommendation ? (
                  <div style={{
                    background: 'var(--gf-input-bg)',
                    border: '1px solid var(--gf-border-focus)',
                    borderRadius: '2px',
                    padding: '12px 14px',
                    fontSize: '13px',
                    lineHeight: '1.6',
                    color: 'var(--gf-text-heading)',
                    fontStyle: 'italic'
                  }}>
                    💡 {recommendation}
                  </div>
                ) : (
                  <span style={{color: 'var(--gf-text-muted)', fontSize: '13px'}}>
                    Execute query to generate recommendation...
                  </span>
                )}
              </div>
            </div>
            
            <div className="gf-panel" style={{flexGrow: 1}}>
              <div className="gf-panel-header">System Logs</div>
              <div className="gf-panel-content" style={{display: 'flex', flexDirection: 'column'}}>
                <div className="gf-logs">
                  <div className="gf-log-line">System initialized.</div>
                  <div className="gf-log-line log-info">Awaiting manual query trigger...</div>
                  {result && (
                    <>
                      <div className="gf-log-line">Query executed at {lastUpdated}</div>
                      <div className="gf-log-line log-ok">RF Response received (Acc: 78.71%)</div>
                      <div className="gf-log-line log-ok">SVM Response received (Acc: 82.04%)</div>
                      {result.rf_prediction === result.svm_prediction ? (
                        <div className={`gf-log-line ${result.rf_prediction === 1 ? 'log-crit' : 'log-ok'}`}>
                          [CONSENSUS] Both models agree customer will {result.rf_prediction === 1 ? 'CHURN' : 'STAY'}.
                        </div>
                      ) : (
                        <div className="gf-log-line log-warn">
                          [WARNING] Model discrepancy detected. Manual review required.
                        </div>
                      )}
                      {recommendation && (
                        <div className="gf-log-line log-ok">
                          [AI ADVISOR] Retention recommendation generated successfully.
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>

          </div>

        </div>
      </div>
    </>
  );
}

export default App;
