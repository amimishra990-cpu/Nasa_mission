import React, { useState, useMemo } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Search, Zap, Brain, Globe, Atom, RotateCcw } from 'lucide-react';
import './SimpleCalculator.css';

// Physical constants
const CONSTANTS = {
    G: 6.67430e-11,
    c: 2.99792458e8,
    sigma: 5.670374419e-8,
    AU: 1.495978707e11,
    R_sun: 6.96e8,
    M_sun: 1.989e30,
    R_earth: 6.371e6,
    M_earth: 5.972e24,
    L_sun: 3.828e26,
};

const SimpleCalculator = () => {
    const [inputs, setInputs] = useState({
        radialVelocity: 10.0,
        restWavelength: 550,
        planetRadius: 1.1,
        stellarRadius: 1.0,
        stellarMass: 1.0,
        planetMass: 0.001,
        orbitalPeriod: 365.25,
        stellarTemperature: 5778,
        currentWeight: 1.0,
        prediction: 0.7,
        humanFeedback: true,
        learningRate: 0.1,
    });

    const handleInputChange = (key, value) => {
        setInputs(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const resetCalculator = () => {
        setInputs({
            radialVelocity: 10.0,
            restWavelength: 550,
            planetRadius: 1.1,
            stellarRadius: 1.0,
            stellarMass: 1.0,
            planetMass: 0.001,
            orbitalPeriod: 365.25,
            stellarTemperature: 5778,
            currentWeight: 1.0,
            prediction: 0.7,
            humanFeedback: true,
            learningRate: 0.1,
        });
    };

    const calculations = useMemo(() => {
        const results = {};
        
        try {
            // Radial Velocity
            const wavelengthShiftRatio = inputs.radialVelocity / CONSTANTS.c;
            const restWavelengthM = inputs.restWavelength * 1e-9;
            const wavelengthShift = wavelengthShiftRatio * restWavelengthM;
            
            results.dopplerShift = {
                wavelengthShiftNm: wavelengthShift * 1e9,
                wavelengthShiftRatio,
            };

            // Transit Method
            const radiusRatio = (inputs.planetRadius * CONSTANTS.R_earth) / (inputs.stellarRadius * CONSTANTS.R_sun);
            const transitDepth = radiusRatio ** 2;
            
            results.transitMethod = {
                transitDepthPpm: transitDepth * 1e6,
                radiusRatio,
            };

            // Kepler's Law
            const totalMass = (inputs.stellarMass * CONSTANTS.M_sun) + (inputs.planetMass * CONSTANTS.M_earth);
            const periodSeconds = inputs.orbitalPeriod * 24 * 3600;
            const orbitalDistanceM = ((CONSTANTS.G * totalMass * periodSeconds**2) / (4 * Math.PI**2))**(1/3);
            const orbitalDistanceAU = orbitalDistanceM / CONSTANTS.AU;
            
            results.keplersLaw = {
                orbitalDistanceAU,
                totalMass,
            };

            // Stefan-Boltzmann
            const stellarRadiusM = inputs.stellarRadius * CONSTANTS.R_sun;
            const luminosityWatts = 4 * Math.PI * stellarRadiusM**2 * CONSTANTS.sigma * inputs.stellarTemperature**4;
            const luminositySolar = luminosityWatts / CONSTANTS.L_sun;
            
            results.stefanBoltzmann = {
                luminositySolar,
                luminosityWatts,
            };

            // Novel Feedback Formula
            const h = inputs.humanFeedback ? 1.0 : 0.0;
            const P = Math.max(0.001, Math.min(0.999, inputs.prediction));
            const binaryCrossEntropyLoss = -h * Math.log(P) - (1 - h) * Math.log(1 - P);
            const lossGradient = -h / P + (1 - h) / (1 - P);
            const weightAdjustment = inputs.learningRate * lossGradient;
            const newWeight = Math.max(0.1, Math.min(2.0, inputs.currentWeight - weightAdjustment));
            
            results.feedbackWeight = {
                binaryCrossEntropyLoss,
                lossGradient,
                weightChange: newWeight - inputs.currentWeight,
                newWeight,
            };

        } catch (error) {
            console.error('Calculation error:', error);
        }
        
        return results;
    }, [inputs]);

    const FormulaCard = ({ title, icon: Icon, formula, result, color = "blue", children }) => {
        const borderColor = color === 'purple' ? 'border-purple-500/30' : 
                           color === 'red' ? 'border-red-500/30' :
                           color === 'green' ? 'border-green-500/30' :
                           color === 'yellow' ? 'border-yellow-500/30' :
                           'border-blue-500/30';
        
        return (
        <Card className={`bg-black/20 backdrop-blur-sm border ${borderColor} shadow-2xl`}>
            <CardHeader className="bg-gradient-to-r from-black/40 to-black/20 border-b border-gray-500/20">
                <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-600/20 rounded-lg border border-gray-500/30">
                            <Icon className="h-6 w-6 text-blue-400" />
                        </div>
                        <div>
                            <h3 className="text-white font-mono text-lg tracking-wide">{title}</h3>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                                <span className="text-green-300 text-xs font-mono">COMPUTATIONAL MODULE ACTIVE</span>
                            </div>
                        </div>
                    </div>
                </CardTitle>
                <div className="bg-black/60 border border-gray-500/30 p-4 rounded-lg mt-4">
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-blue-300 text-xs font-mono">FORMULA:</span>
                        <div className="w-1 h-1 bg-blue-400 rounded-full"></div>
                    </div>
                    <div className="font-mono text-white text-lg tracking-wider bg-gradient-to-r from-gray-900 to-black p-3 rounded border border-gray-700">
                        {formula}
                    </div>
                </div>
            </CardHeader>
            <CardContent className="bg-black/10 p-6">
                <div className="mb-6">
                    <h4 className="text-blue-300 font-mono text-sm mb-4 tracking-wider">PARAMETER INPUT MATRIX</h4>
                    <div className="bg-black/40 p-4 rounded-lg border border-gray-700">
                        {children}
                    </div>
                </div>
                <div className="bg-gradient-to-r from-gray-900/20 to-black/40 p-4 rounded-lg border border-gray-500/20">
                    <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        <h4 className="text-green-300 font-mono text-sm tracking-wider">COMPUTATIONAL RESULTS</h4>
                    </div>
                    <div className="bg-black/60 p-3 rounded border border-gray-700 font-mono text-sm">
                        {result}
                    </div>
                </div>
            </CardContent>
        </Card>
        );
    };

    return (
        <div className="simple-calculator-wrapper min-h-screen p-4 sm:p-6 lg:p-8" style={{background: 'linear-gradient(180deg, #0B0C10 0%, #0B1523 50%, #0F1F2E 100%)'}}>
            <div className="max-w-7xl mx-auto px-2 sm:px-4">
                <div className="text-center mb-6 sm:mb-8">
                    <div className="mb-4">
                        <div className="inline-flex items-center gap-2 sm:gap-3 bg-black/20 backdrop-blur-sm rounded-full px-4 sm:px-6 py-2 border border-white/20">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-green-300 text-xs sm:text-sm font-mono">OBSERVATORY STATUS: ONLINE</span>
                        </div>
                    </div>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 tracking-tight px-4">
                        <span style={{background: 'linear-gradient(135deg, #0B3D91 0%, #2E5090 50%, #66FCF1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
                            EXOPLANET RESEARCH STATION
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg md:text-xl mb-2 font-light px-4" style={{color: '#C5C6C7'}}>
                        Advanced Computational Analysis Suite
                    </p>
                    <p className="text-xs sm:text-sm mb-6 font-mono px-4" style={{color: '#66FCF1', letterSpacing: '2px'}}>
                        NASA • ESA • JWST • TESS • KEPLER MISSION DATA
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-4 mt-6 px-4">
                        <Button 
                            onClick={resetCalculator} 
                            style={{background: 'linear-gradient(135deg, #FC3D21 0%, #d97706 100%)', boxShadow: '0 4px 15px rgba(252, 61, 33, 0.3)'}}
                            className="hover:bg-red-600 text-white border border-red-400/50 backdrop-blur-sm w-full sm:w-auto font-semibold"
                        >
                            <RotateCcw className="w-4 h-4 mr-2" />
                            SYSTEM RESET
                        </Button>
                        <div className="px-4 py-2 rounded-md w-full sm:w-auto text-center" style={{background: 'rgba(11, 61, 145, 0.2)', border: '1px solid rgba(11, 61, 145, 0.4)'}}>
                            <span className="text-xs sm:text-sm font-mono" style={{color: '#66FCF1'}}>
                                CALCULATIONS: {Object.keys(calculations).length} ACTIVE
                            </span>
                        </div>
                    </div>
                </div>

                <Tabs defaultValue="feedback" className="w-full">
                    <div className="mb-8">
                        <div className="bg-black/30 backdrop-blur-sm rounded-lg p-6 border border-white/10">
                            <h2 className="text-2xl font-bold text-white mb-2 text-center font-mono tracking-wider">
                                ANALYSIS MODULES
                            </h2>
                            <p className="text-center text-blue-300 text-sm mb-6">
                                Select computational method for exoplanet parameter analysis
                            </p>
                            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 mb-4 p-2 rounded-lg" style={{background: 'rgba(11, 12, 16, 0.5)', border: '1px solid rgba(11, 61, 145, 0.3)'}}>
                                <TabsTrigger value="feedback" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white text-purple-200 font-mono text-xs px-2 py-2">
                                    ⚡ AI-ML
                                </TabsTrigger>
                                <TabsTrigger value="doppler" className="data-[state=active]:bg-red-600 data-[state=active]:text-white text-red-200 font-mono text-xs px-2 py-2">
                                    📡 RV
                                </TabsTrigger>
                                <TabsTrigger value="transit" className="data-[state=active]:bg-green-600 data-[state=active]:text-white text-green-200 font-mono text-xs px-2 py-2">
                                    🌍 TRANSIT
                                </TabsTrigger>
                                <TabsTrigger value="kepler" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-blue-200 font-mono text-xs px-2 py-2">
                                    ⚛️ ORBITAL
                                </TabsTrigger>
                                <TabsTrigger value="stefan" className="data-[state=active]:bg-yellow-600 data-[state=active]:text-white text-yellow-200 font-mono text-xs px-2 py-2">
                                    ⭐ STELLAR
                                </TabsTrigger>
                            </TabsList>
                            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 text-xs text-center mt-2">
                                <div className="text-purple-300 font-mono">MACHINE LEARNING</div>
                                <div className="text-red-300 font-mono">DOPPLER SHIFT</div>
                                <div className="text-green-300 font-mono">PHOTOMETRY</div>
                                <div className="text-blue-300 font-mono">MECHANICS</div>
                                <div className="text-yellow-300 font-mono">LUMINOSITY</div>
                            </div>
                        </div>
                    </div>

                    {/* Novel Feedback Formula */}
                    <TabsContent value="feedback">
                        <FormulaCard
                            title="⚡ Novel Feedback-Based Knowledge Weight"
                            icon={Brain}
                            formula="wᵢ ← wᵢ - η∂L/∂wᵢ where L = -h log P - (1-h) log(1-P)"
                            color="purple"
                            result={
                                calculations.feedbackWeight && (
                                    <div className="space-y-3 text-white">
                                        <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                                            <span className="text-purple-300">BINARY CROSS-ENTROPY LOSS:</span>
                                            <span className="font-mono text-green-400">{calculations.feedbackWeight.binaryCrossEntropyLoss?.toFixed(6)}</span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-gray-600 pb-2">
                                            <span className="text-purple-300">WEIGHT ADJUSTMENT Δw:</span>
                                            <span className="font-mono text-yellow-400">{calculations.feedbackWeight.weightChange?.toFixed(6)}</span>
                                        </div>
                                        <div className="flex justify-between items-center">
                                            <span className="text-purple-300">UPDATED RELIABILITY WEIGHT:</span>
                                            <span className="font-mono text-blue-400 text-lg">{calculations.feedbackWeight.newWeight?.toFixed(4)}</span>
                                        </div>
                                    </div>
                                )
                            }
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                                <div>
                                    <Label htmlFor="currentWeight" className="text-purple-300 font-mono text-xs tracking-wider">RELIABILITY WEIGHT (wᵢ)</Label>
                                    <Input
                                        id="currentWeight"
                                        type="number"
                                        value={inputs.currentWeight}
                                        onChange={(e) => handleInputChange('currentWeight', parseFloat(e.target.value))}
                                        step="0.1"
                                        className="bg-black/60 border-purple-500/30 text-white font-mono"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="prediction" className="text-purple-300 font-mono text-xs tracking-wider">PREDICTION CONFIDENCE (P)</Label>
                                    <Input
                                        id="prediction"
                                        type="number"
                                        value={inputs.prediction}
                                        onChange={(e) => handleInputChange('prediction', parseFloat(e.target.value))}
                                        step="0.1"
                                        min="0"
                                        max="1"
                                        className="bg-black/60 border-purple-500/30 text-white font-mono"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="learningRate" className="text-purple-300 font-mono text-xs tracking-wider">LEARNING RATE (η)</Label>
                                    <Input
                                        id="learningRate"
                                        type="number"
                                        value={inputs.learningRate}
                                        onChange={(e) => handleInputChange('learningRate', parseFloat(e.target.value))}
                                        step="0.01"
                                        className="bg-black/60 border-purple-500/30 text-white font-mono"
                                    />
                                </div>
                                <div className="flex items-center space-x-3 bg-black/40 p-3 rounded border border-purple-500/20">
                                    <input
                                        id="humanFeedback"
                                        type="checkbox"
                                        checked={inputs.humanFeedback}
                                        onChange={(e) => handleInputChange('humanFeedback', e.target.checked)}
                                        className="h-4 w-4 accent-purple-500"
                                    />
                                    <Label htmlFor="humanFeedback" className="text-purple-300 font-mono text-xs tracking-wider">EXPERT VALIDATION (h)</Label>
                                </div>
                            </div>
                        </FormulaCard>
                    </TabsContent>

                    {/* Radial Velocity */}
                    <TabsContent value="doppler">
                        <FormulaCard
                            title="Radial Velocity (Doppler Shift)"
                            icon={Search}
                            formula="Δλ/λ = vᵣ/c"
                            color="red"
                            result={
                                calculations.dopplerShift && (
                                    <div className="space-y-2">
                                        <p><strong>Wavelength Shift:</strong> {calculations.dopplerShift.wavelengthShiftNm?.toFixed(4)} nm</p>
                                        <p><strong>Shift Ratio:</strong> {(calculations.dopplerShift.wavelengthShiftRatio * 1e6)?.toFixed(2)} ppm</p>
                                    </div>
                                )
                            }
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="radialVelocity">Radial Velocity (m/s)</Label>
                                    <Input
                                        id="radialVelocity"
                                        type="number"
                                        value={inputs.radialVelocity}
                                        onChange={(e) => handleInputChange('radialVelocity', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="restWavelength">Rest Wavelength (nm)</Label>
                                    <Input
                                        id="restWavelength"
                                        type="number"
                                        value={inputs.restWavelength}
                                        onChange={(e) => handleInputChange('restWavelength', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                            </div>
                        </FormulaCard>
                    </TabsContent>

                    {/* Transit Method */}
                    <TabsContent value="transit">
                        <FormulaCard
                            title="Transit Method"
                            icon={Globe}
                            formula="ΔF/F = (Rₚ/Rₛ)²"
                            color="green"
                            result={
                                calculations.transitMethod && (
                                    <div className="space-y-2">
                                        <p><strong>Transit Depth:</strong> {calculations.transitMethod.transitDepthPpm?.toFixed(0)} ppm</p>
                                        <p><strong>Radius Ratio:</strong> {calculations.transitMethod.radiusRatio?.toFixed(4)}</p>
                                    </div>
                                )
                            }
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="planetRadius">Planet Radius (R⊕)</Label>
                                    <Input
                                        id="planetRadius"
                                        type="number"
                                        value={inputs.planetRadius}
                                        onChange={(e) => handleInputChange('planetRadius', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="stellarRadius">Stellar Radius (R☉)</Label>
                                    <Input
                                        id="stellarRadius"
                                        type="number"
                                        value={inputs.stellarRadius}
                                        onChange={(e) => handleInputChange('stellarRadius', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                            </div>
                        </FormulaCard>
                    </TabsContent>

                    {/* Kepler's Law */}
                    <TabsContent value="kepler">
                        <FormulaCard
                            title="Kepler's 3rd Law"
                            icon={Atom}
                            formula="P² = 4π²a³/G(M* + Mₚ)"
                            color="blue"
                            result={
                                calculations.keplersLaw && (
                                    <div className="space-y-2">
                                        <p><strong>Orbital Distance:</strong> {calculations.keplersLaw.orbitalDistanceAU?.toFixed(3)} AU</p>
                                        <p><strong>Total Mass:</strong> {(calculations.keplersLaw.totalMass / CONSTANTS.M_sun)?.toFixed(3)} M☉</p>
                                    </div>
                                )
                            }
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div>
                                    <Label htmlFor="stellarMass">Stellar Mass (M☉)</Label>
                                    <Input
                                        id="stellarMass"
                                        type="number"
                                        value={inputs.stellarMass}
                                        onChange={(e) => handleInputChange('stellarMass', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="planetMass">Planet Mass (M⊕)</Label>
                                    <Input
                                        id="planetMass"
                                        type="number"
                                        value={inputs.planetMass}
                                        onChange={(e) => handleInputChange('planetMass', parseFloat(e.target.value))}
                                        step="0.001"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="orbitalPeriod">Orbital Period (days)</Label>
                                    <Input
                                        id="orbitalPeriod"
                                        type="number"
                                        value={inputs.orbitalPeriod}
                                        onChange={(e) => handleInputChange('orbitalPeriod', parseFloat(e.target.value))}
                                        step="1"
                                    />
                                </div>
                            </div>
                        </FormulaCard>
                    </TabsContent>

                    {/* Stefan-Boltzmann */}
                    <TabsContent value="stefan">
                        <FormulaCard
                            title="Stefan-Boltzmann Law"
                            icon={Zap}
                            formula="L = 4πRₛ²σT⁴"
                            color="yellow"
                            result={
                                calculations.stefanBoltzmann && (
                                    <div className="space-y-2">
                                        <p><strong>Luminosity:</strong> {calculations.stefanBoltzmann.luminositySolar?.toFixed(2)} L☉</p>
                                        <p><strong>Luminosity (Watts):</strong> {calculations.stefanBoltzmann.luminosityWatts?.toExponential(2)} W</p>
                                    </div>
                                )
                            }
                        >
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <Label htmlFor="stellarRadius2">Stellar Radius (R☉)</Label>
                                    <Input
                                        id="stellarRadius2"
                                        type="number"
                                        value={inputs.stellarRadius}
                                        onChange={(e) => handleInputChange('stellarRadius', parseFloat(e.target.value))}
                                        step="0.1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="stellarTemperature">Temperature (K)</Label>
                                    <Input
                                        id="stellarTemperature"
                                        type="number"
                                        value={inputs.stellarTemperature}
                                        onChange={(e) => handleInputChange('stellarTemperature', parseFloat(e.target.value))}
                                        step="50"
                                    />
                                </div>
                            </div>
                        </FormulaCard>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
};

export default SimpleCalculator;
