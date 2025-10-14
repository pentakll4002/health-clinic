import { useState } from 'react';
import styled from 'styled-components';
import { CameraIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import Subtract from '../assets/Subtract.png';

export default function InputImage() {
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file) setPreview(URL.createObjectURL(file));
  };

  return (
    <Container>
      <Label>Profile Image</Label>
      <AvatarWrapper>
        {preview ? (
          <Avatar src={preview} alt='Profile' />
        ) : (
          <Placeholder>
            <UserPlusIcon className='w-5 h-5 text-[#6B7280]' />
          </Placeholder>
        )}

        <UploadLabel htmlFor='fileUpload'>
          <CameraIcon className='w-4 h-4 text-white' />
        </UploadLabel>
        <input
          id='fileUpload'
          type='file'
          accept='image/*'
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </AvatarWrapper>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 1.5rem;

`;

const Label = styled.span`
  font-size: 15px;
  font-weight: 500;
  color: #1a2e46;
`;

const AvatarWrapper = styled.div`
  position: relative;
  width: 100px;
  height: 100px;
`;

const Placeholder = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background-color: #cfd3d8;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Avatar = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
`;

const UploadLabel = styled.label`
  position: absolute;
  bottom: 0;
  left: 46%;
  transform: translateX(-50%);
  width: 100px;
  height: 60px;
  background-image: url(${Subtract});
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  padding-top: 30px;
  padding-left: 5px;
`;
