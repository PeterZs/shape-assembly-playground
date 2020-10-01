import React, { useRef, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import { TransformControls } from 'drei';
import * as THREE from 'three';
import BaseCuboid, { makeCuboidMatrix } from './BaseCuboid';

const EditableCuboid = ({ cuboid, orbitRef }) => {
  const transformRef = useRef();
  const editingCuboidMode = useSelector((state) => state.executorSlice.editingCuboidMode);
  const geometryRef = useRef();

  // Disable drag for the orbit camera when dragging the transform controls.
  useEffect(() => {
    const controls = transformRef.current;
    if (controls) {
      const callback = (event) => {
        if (geometryRef.current) {
          controls.updateMatrixWorld(geometryRef.current);
        }
        // eslint-disable-next-line no-param-reassign
        const dragging = event.value;
        orbitRef.current.enabled = !dragging;

        if (!dragging) {
          if (editingCuboidMode === 'translate') {
            const newPosition = controls.worldPosition;
            console.log(`NEW POSITION:`, newPosition);
          }
        }
      };
      controls.addEventListener('dragging-changed', callback);
      return () => {
        // Not detaching the controls creates weird errors.
        controls.detach();
        controls.removeEventListener('dragging-changed', callback);
      };
    }
    return () => {};
  });

  // Wrap the base cuboid in TransformControls.
  const position = new THREE.Vector3();
  const quaternion = new THREE.Quaternion();
  const scale = new THREE.Vector3();
  makeCuboidMatrix(cuboid).decompose(position, quaternion, scale);

  return (
    <TransformControls
      ref={transformRef}
      mode={editingCuboidMode}
      quaternion={quaternion}
      position={position}
      space="local"
    >
      <group scale={scale}>
        <BaseCuboid cuboid={cuboid} color="red" geometryRef={geometryRef} />
      </group>
    </TransformControls>
  );
};

EditableCuboid.propTypes = {
  cuboid: PropTypes.shape({
    position: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    dimensions: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    frontNormal: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    topNormal: PropTypes.arrayOf(PropTypes.number.isRequired).isRequired,
    globalLineIndex: PropTypes.number.isRequired,
  }).isRequired,

  // eslint-disable-next-line react/forbid-prop-types
  orbitRef: PropTypes.any, // It's a ref.
};

EditableCuboid.defaultProps = {
  orbitRef: undefined,
};

export default EditableCuboid;
