import { useState } from 'react';
import { TextField } from '@/components/md3/TextField';
import { SegmentedButton } from '@/components/md3/SegmentedButton';
import { Card } from '@/components/md3/Card';

export function Calculator() {
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [gender, setGender] = useState<'male' | 'female'>('male');

  const calculateCrCl = () => {
    const ageNum = parseFloat(age);
    const weightNum = parseFloat(weight);
    const creatinineNum = parseFloat(creatinine);

    if (isNaN(ageNum) || isNaN(weightNum) || isNaN(creatinineNum) || ageNum <= 0 || weightNum <= 0 || creatinineNum <= 0) {
      return 'Please enter valid numbers.';
    }

    let crcl = ((140 - ageNum) * weightNum) / (72 * creatinineNum);

    if (gender === 'female') {
      crcl *= 0.85;
    }

    return `${crcl.toFixed(2)} mL/min`;
  };

  return (
    <Card className="p-4 flex flex-col gap-4">
      <div className="flex gap-2">
        <SegmentedButton
          label="Male"
          selected={gender === 'male'}
          onClick={() => setGender('male')}
        />
        <SegmentedButton
          label="Female"
          selected={gender === 'female'}
          onClick={() => setGender('female')}
        />
      </div>
      <TextField
        label="Age (years)"
        value={age}
        onChange={(e) => setAge(e.target.value)}
        type="number"
        inputMode="numeric"
        min="1"
      />
      <TextField
        label="Weight (kg)"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
        type="number"
        inputMode="numeric"
        min="1"
      />
      <TextField
        label="Serum Creatinine (mg/dL)"
        value={creatinine}
        onChange={(e) => setCreatinine(e.target.value)}
        type="number"
        inputMode="numeric"
        min="0.1"
      />
      <div className="text-2xl font-bold text-center mt-4">
        Creatinine Clearance: {calculateCrCl()}
      </div>
    </Card>
  );
}
